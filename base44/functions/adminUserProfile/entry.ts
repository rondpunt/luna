import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function sanitizeMessage(message) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    created_date: message.created_date,
    risk_level: message.risk_level || 'none'
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const admin = await base44.auth.me();

    if (admin?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: admin access required' }, { status: 403 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }

    const [users, conversations, messages, checkins, diaries, journals, selectedTags, memories, subscriptions] = await Promise.all([
      base44.asServiceRole.entities.User.list('-created_date', 1000),
      base44.asServiceRole.entities.Conversation.list('-updated_date', 3000),
      base44.asServiceRole.entities.Message.list('-created_date', 8000),
      base44.asServiceRole.entities.CheckIn.list('-created_date', 1000),
      base44.asServiceRole.entities.DiaryEntry.list('-created_date', 1000),
      base44.asServiceRole.entities.JournalEntry.list('-created_date', 1000),
      base44.asServiceRole.entities.UserSelectedTags.list('-created_date', 1000),
      base44.asServiceRole.entities.Memory.list('-created_date', 1000),
      base44.asServiceRole.entities.Subscription.list('-created_date', 1000)
    ]);

    const user = users.find((item) => item.id === userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userConversations = conversations
      .filter((conversation) => conversation.userId === user.id || conversation.created_by === user.email)
      .sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date));

    const conversationIds = new Set(userConversations.map((conversation) => conversation.id));
    const userMessages = messages
      .filter((message) => conversationIds.has(message.conversation_id))
      .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

    const userCheckins = checkins.filter((item) => item.created_by === user.email);
    const userDiaries = diaries.filter((item) => item.created_by === user.email);
    const userJournals = journals.filter((item) => item.userId === user.id || item.created_by === user.email);
    const tagRow = selectedTags.find((item) => item.userId === user.id);
    const userMemories = memories.filter((item) => item.userId === user.id || item.created_by === user.email);
    const subscription = subscriptions.find((item) => item.userId === user.id) || null;

    const averageMood = userCheckins.length
      ? Math.round((userCheckins.reduce((sum, item) => sum + Number(item.score || 0), 0) / userCheckins.length) * 10) / 10
      : null;

    const transcript = userMessages
      .filter((message) => message.role === 'user')
      .slice(-80)
      .map((message) => message.content)
      .join('\n')
      .slice(0, 9000);

    const aiProfile = transcript || tagRow?.tags?.length
      ? await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Maak een compact admin-profiel in het Nederlands op basis van deze data. Geen diagnose stellen. Geef alleen observeerbare patronen, mogelijke behoeften, risico-signalen en product/personalisatie-aanbevelingen.\n\nGebruiker: ${user.full_name || user.email}\nGekozen woorden: ${(tagRow?.tags || []).join(', ')}\nGemiddelde check-in: ${averageMood ?? 'onbekend'}\nLaatste gebruikersberichten:\n${transcript}`,
          response_json_schema: {
            type: 'object',
            properties: {
              summary: { type: 'string' },
              emotionalPatterns: { type: 'array', items: { type: 'string' } },
              needs: { type: 'array', items: { type: 'string' } },
              riskSignals: { type: 'array', items: { type: 'string' } },
              productHooks: { type: 'array', items: { type: 'string' } },
              recommendedTone: { type: 'string' }
            },
            required: ['summary', 'emotionalPatterns', 'needs', 'riskSignals', 'productHooks', 'recommendedTone']
          }
        })
      : null;

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_date: user.created_date
      },
      subscription,
      selectedTags: tagRow?.tags || [],
      stats: {
        conversations: userConversations.length,
        messages: userMessages.length,
        userMessages: userMessages.filter((message) => message.role === 'user').length,
        checkins: userCheckins.length,
        diaryEntries: userDiaries.length,
        journalEntries: userJournals.length,
        memories: userMemories.length,
        averageMood
      },
      conversations: userConversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title || 'Zonder titel',
        created_date: conversation.created_date,
        updated_date: conversation.updated_date,
        last_message_at: conversation.last_message_at,
        messages: userMessages
          .filter((message) => message.conversation_id === conversation.id)
          .map(sanitizeMessage)
      })),
      checkins: userCheckins,
      diaries: userDiaries,
      journals: userJournals,
      memories: userMemories,
      aiProfile
    });
  } catch (error) {
    console.error('adminUserProfile error:', error?.message || error);
    return Response.json({ error: error?.message || 'Admin user profile failed' }, { status: 500 });
  }
});