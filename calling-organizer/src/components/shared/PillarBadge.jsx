import { getPillarConfig } from '../../data/callings';

const PILLAR_CLASSES = {
  living: 'badge-pillar-living',
  caring: 'badge-pillar-caring',
  inviting: 'badge-pillar-inviting',
  uniting: 'badge-pillar-uniting',
  admin: 'badge-pillar-admin',
};

export default function PillarBadge({ pillar, compact = false }) {
  const config = getPillarConfig(pillar);
  const cls = PILLAR_CLASSES[pillar] || PILLAR_CLASSES.admin;

  if (compact) {
    return (
      <span className={`badge ${cls}`}>
        {config.label.split(' ')[0]}
      </span>
    );
  }

  return (
    <span className={`badge ${cls}`}>
      {config.label}
    </span>
  );
}
