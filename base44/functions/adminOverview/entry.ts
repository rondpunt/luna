import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function dayOf(record) {
  return (record?.date || record?.created_date || '').split('T')[0];
}

function compactUser(user) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    created_date: user.created_date
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const admin = await base44.auth.me();

    if (admin?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });
    }

    const [users, conversations, messages, checkins, diaries, journals, selectedTags, subscriptions] = await Promise.all([
      base44.asServiceRole.entities.User.list('-created_date', 1000),
      base44.asServiceRole.entities.Conversation.list('-updated_date', 3000),
      base44.asServiceRole.entities.Message.list('-created_date', 8000),
      base44.asServiceRole.entities.CheckIn.list('-created_date', 5000),
      base44.asServiceRole.entities.DiaryEntry.list('-created_date', 3000),
      base44.asServiceRole.entities.JournalEntry.list('-created_date', 3000),
      base44.asServiceRole.entities.UserSelectedTags.list('-created_date', 2000),
      base44.asServiceRole.entities.Subscription.list('-created_date', 2000)
    ]);

    const usersById = new Map(users.map((user) => [user.id, compactUser(user)]));
    const tagsByUser = new Map();
    const subByUser = new Map();

    for (const row of selectedTags) {
      if (!tagsByUser.has(row.userId)) tagsByUser.set(row.userId, row.tags || []);
    }

    for (const sub of subscriptions) {
      if (!subByUser.has(sub.userId)) subByUser.set(sub.userId, sub);
    }

    const conversationsByUser = new Map();
    for (const conversation of conversations) {
      const userId = conversation.userId || conversation.created_by;
      if (!conversationsByUser.has(userId)) conversationsByUser.set(userId, []);
      conversationsByUser.get(userId).push(conversation);
    }

    const messagesByConversation = new Map();
    for (const message of messages) {
      if (!messagesByConversation.has(message.conversation_id)) messagesByConversation.set(message.conversation_id, []);
      messagesByConversation.get(message.conversation_id).push(message);
    }

    const checkinsByCreator = new Map();
    for (const checkin of checkins) {
      const key = checkin.created_by;
      if (!checkinsByCreator.has(key)) checkinsByCreator.set(key, []);
      checkinsByCreator.get(key).push(checkin);
    }

    const diariesByCreator = new Map();
    for (const diary of diaries) {
      const key = diary.created_by;
      if (!diariesByCreator.has(key)) diariesByCreator.set(key, []);
      diariesByCreator.get(key).push(diary);
    }

    const journalsByUser = new Map();
    for (const journal of journals) {
      const key = journal.userId || journal.created_by;
      if (!journalsByUser.has(key)) journalsByUser.set(key, []);
      journalsByUser.get(key).push(journal);
    }

    const userRows = users.map((user) => {
      const userConversations = conversationsByUser.get(user.id) || conversationsByUser.get(user.email) || [];
      const userMessages = userConversations.flatMap((conversation) => messagesByConversation.get(conversation.id) || []);
      const userCheckins = checkinsByCreator.get(user.email) || [];
      const userDiaries = diariesByCreator.get(user.email) || [];
      const userJournals = journalsByUser.get(user.id) || journalsByUser.get(user.email) || [];
      const activeDays = new Set([
        ...userMessages.map(dayOf),
        ...userCheckins.map(dayOf),
        ...userDiaries.map(dayOf),
        ...userJournals.map(dayOf)
      ].filter(Boolean));
      const lastActivity = [
        ...userMessages.map((m) => m.created_date),
        ...userCheckins.map((c) => c.created_date),
        ...userDiaries.map((d) => d.created_date),
        ...userJournals.map((j) => j.created_date)
      ].filter(Boolean).sort().pop() || user.created_date;

      return {
        ...compactUser(user),
        subscription: subByUser.get(user.id) || null,
        selectedTags: tagsByUser.get(user.id) || [],
        stats: {
          conversations: userConversations.length,
          messages: userMessages.length,
          userMessages: userMessages.filter((m) => m.role === 'user').length,
          checkins: userCheckins.length,
          diaryEntries: userDiaries.length,
          journalEntries: userJournals.length,
          activeDays: activeDays.size,
          lastActivity
        }
      };
    });

    return Response.json({
      totals: {
        users: users.length,
        conversations: conversations.length,
        messages: messages.length,
        checkins: checkins.length,
        diaryEntries: diaries.length,
        journalEntries: journals.length,
        selectedTagProfiles: selectedTags.length,
        plusUsers: subscriptions.filter((s) => s.plan !== 'free' && s.status === 'active').length
      },
      users: userRows.sort((a, b) => new Date(b.stats.lastActivity || 0) - new Date(a.stats.lastActivity || 0))
    });
  } catch (error) {
    console.error('adminOverview error:', error?.message || error);
    return Response.json({ error: error?.message || 'Admin overview failed' }, { status: 500 });
  }
});