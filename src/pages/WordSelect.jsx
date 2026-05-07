import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TagConstellation from "@/components/onboarding/TagConstellation";
import { FALLBACK_TAGS, INITIAL_TAG_LABELS } from "@/lib/lunaTags";

const MAX_SELECTED = 15;
const MAX_VISIBLE = 10;
const STALE_AFTER = 2;

const keyOf = (tag) => tag?.label?.toLowerCase?.() || "";

export default function WordSelect() {
  const navigate = useNavigate();
  const [allTags, setAllTags] = useState(FALLBACK_TAGS);
  const [visibleTags, setVisibleTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [seenTags, setSeenTags] = useState(new Set());
  const [roundsUnpicked, setRoundsUnpicked] = useState({});
  const [clicksInRound, setClicksInRound] = useState(0);
  const [saving, setSaving] = useState(false);

  const byLabel = useMemo(() => {
    const map = new Map();
    allTags.forEach((tag) => map.set(keyOf(tag), tag));
    return map;
  }, [allTags]);

  useEffect(() => {
    const load = async () => {
      let tags = FALLBACK_TAGS;
      try {
        const remote = await base44.entities.Tag.list();
        if (remote?.length) {
          tags = remote.filter((t) => t.is_active !== false);
        } else {
          base44.entities.Tag.bulkCreate(FALLBACK_TAGS).catch(() => {});
        }
      } catch {}
      const first = INITIAL_TAG_LABELS.map((label) => tags.find((t) => keyOf(t) === label)).filter(Boolean).slice(0, MAX_VISIBLE);
      const initial = first.length ? first : tags.filter((t) => t.level === 0).slice(0, MAX_VISIBLE);
      setAllTags(tags);
      setVisibleTags(initial);
      setSeenTags(new Set(initial.map(keyOf)));
    };
    load();
  }, []);

  const pickLeastUsedClusterTag = (currentSeen, currentVisible, preferredCluster) => {
    const blocked = new Set([...currentSeen, ...currentVisible.map(keyOf)]);
    const selectedClusters = selectedTags.reduce((acc, tag) => ({ ...acc, [tag.cluster]: (acc[tag.cluster] || 0) + 1 }), {});
    const candidates = allTags
      .filter((tag) => !blocked.has(keyOf(tag)))
      .sort((a, b) => {
        if (preferredCluster && a.cluster === preferredCluster && b.cluster !== preferredCluster) return -1;
        if (preferredCluster && b.cluster === preferredCluster && a.cluster !== preferredCluster) return 1;
        return (selectedClusters[a.cluster] || 0) - (selectedClusters[b.cluster] || 0) || (a.level || 0) - (b.level || 0);
      });
    return candidates[0] || null;
  };

  const nextFor = (tag, currentSeen, currentVisible) => {
    const relation = [...(tag.relations || [])]
      .sort((a, b) => (b.strength || 0) - (a.strength || 0))
      .find((rel) => !currentSeen.has(rel.toLabel?.toLowerCase?.()) && byLabel.has(rel.toLabel?.toLowerCase?.()));
    if (relation) return byLabel.get(relation.toLabel.toLowerCase());
    return pickLeastUsedClusterTag(currentSeen, currentVisible, tag.cluster);
  };

  const refreshStaleWords = (currentVisible, currentSeen, nextRounds) => {
    let updated = [...currentVisible];
    Object.entries(nextRounds).forEach(([label, count]) => {
      if (count < STALE_AFTER) return;
      const index = updated.findIndex((tag) => keyOf(tag) === label);
      if (index === -1) return;
      const replacement = pickLeastUsedClusterTag(currentSeen, updated, null);
      if (!replacement) return;
      currentSeen.add(keyOf(replacement));
      updated[index] = replacement;
      delete nextRounds[label];
      nextRounds[keyOf(replacement)] = 0;
    });
    return updated;
  };

  const handleSelect = (tag) => {
    if (selectedTags.some((t) => keyOf(t) === keyOf(tag))) return;
    const nextSelected = [...selectedTags, tag];
    const nextSeen = new Set(seenTags);
    nextSeen.add(keyOf(tag));

    let nextVisible = visibleTags.filter((item) => keyOf(item) !== keyOf(tag));
    const replacement = nextFor(tag, nextSeen, nextVisible);
    if (replacement) {
      nextSeen.add(keyOf(replacement));
      nextVisible = [...nextVisible, replacement].slice(0, MAX_VISIBLE);
    }

    const nextClicks = clicksInRound + 1;
    const nextRounds = { ...roundsUnpicked };
    delete nextRounds[keyOf(tag)];
    if (replacement) nextRounds[keyOf(replacement)] = 0;

    if (nextClicks >= 3) {
      nextVisible.forEach((item) => {
        nextRounds[keyOf(item)] = (nextRounds[keyOf(item)] || 0) + 1;
      });
      nextVisible = refreshStaleWords(nextVisible, nextSeen, nextRounds);
      setClicksInRound(0);
    } else {
      setClicksInRound(nextClicks);
    }

    setSelectedTags(nextSelected);
    setSeenTags(nextSeen);
    setRoundsUnpicked(nextRounds);
    setVisibleTags(nextVisible);

    if (nextSelected.length >= MAX_SELECTED) finish(nextSelected);
  };

  const finish = async (tags = selectedTags) => {
    if (saving) return;
    setSaving(true);
    const labels = tags.map((tag) => tag.label);
    sessionStorage.setItem("luna_selected_tags", JSON.stringify(labels));
    try {
      const user = await base44.auth.me();
      if (user) {
        await base44.entities.UserSelectedTags.create({ userId: user.id, tags: labels, source: "console_intro" });
      }
    } catch {}
    navigate("/chat", { replace: true });
  };

  return <TagConstellation tags={visibleTags} selectedCount={selectedTags.length} onSelect={handleSelect} onContinue={() => finish()} />;
}