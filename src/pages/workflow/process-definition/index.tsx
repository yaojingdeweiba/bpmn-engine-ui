import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { type ProcessDefinition, type ProcessInstance } from '@/services/engine';
import DefinitionList from './components/DefinitionList';
import DefinitionDetail from './components/DefinitionDetail';
import InstanceDetail from './components/InstanceDetail';

type NavState =
  | { view: 'list' }
  | { view: 'definition'; def: ProcessDefinition }
  | { view: 'instance'; def: ProcessDefinition; instance: ProcessInstance };

export default function ProcessDefinitionPage() {
  const [nav, setNav] = useState<NavState>({ view: 'list' });

  const title =
    nav.view === 'list'
      ? 'Process Definitions'
      : nav.view === 'definition'
        ? nav.def.name || nav.def.key
        : `Instance: ${nav.instance.id.slice(0, 8)}…`;

  return (
    <PageContainer title={title}>
      {nav.view === 'list' && (
        <DefinitionList onSelect={(def) => setNav({ view: 'definition', def })} />
      )}
      {nav.view === 'definition' && (
        <DefinitionDetail
          initialDef={nav.def}
          onBack={() => setNav({ view: 'list' })}
          onSelectInstance={(inst, def) => setNav({ view: 'instance', def, instance: inst })}
        />
      )}
      {nav.view === 'instance' && (
        <InstanceDetail
          instance={nav.instance}
          def={nav.def}
          onBack={() => setNav({ view: 'definition', def: nav.def })}
        />
      )}
    </PageContainer>
  );
}
