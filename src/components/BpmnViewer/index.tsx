import { useEffect, useRef, useState } from 'react';
import BpmnJS from 'bpmn-js/lib/NavigatedViewer';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

function ensureHighlightStyles() {
  if (document.getElementById('bpmn-highlight-styles')) return;
  const s = document.createElement('style');
  s.id = 'bpmn-highlight-styles';
  s.textContent = `
    .bpmn-active-marker .djs-visual > :nth-child(1) {
      fill: #e6f4ff !important;
      stroke: #1677ff !important;
      stroke-width: 2px !important;
    }
    .bpmn-activity-badge {
      background: #1677ff; color: #fff; border-radius: 50%;
      min-width: 22px; height: 22px; padding: 0 5px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      box-shadow: 0 1px 4px rgba(22,119,255,.45);
      position: relative; top: 2px; right: 2px;
    }
  `;
  document.head.appendChild(s);
}

export type ActiveActivity = { activityId: string; count: number };

type Props = {
  xml: string;
  height?: number | string;
  activeActivities?: ActiveActivity[];
};

export default function BpmnViewer({ xml, height = 500, activeActivities }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureHighlightStyles();
    if (!containerRef.current) return;
    setError(null);

    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    try {
      viewerRef.current = new BpmnJS({ container: containerRef.current });
    } catch (err: any) {
      setError(`Failed to initialize BPMN viewer: ${err?.message ?? err}`);
      return;
    }

    viewerRef.current
      .importXML(xml)
      .then(() => {
        viewerRef.current?.get('canvas').zoom('fit-viewport', 'auto');

        if (activeActivities?.length) {
          const canvas = viewerRef.current.get('canvas');
          const overlays = viewerRef.current.get('overlays');
          activeActivities.forEach(({ activityId, count }) => {
            try {
              canvas.addMarker(activityId, 'bpmn-active-marker');
              if (count > 0) {
                overlays.add(activityId, {
                  position: { bottom: 0, right: 0 },
                  html: `<div class="bpmn-activity-badge">${count}</div>`,
                });
              }
            } catch {
              /* element may not exist in diagram */
            }
          });
        }
      })
      .catch((err: Error) => {
        console.error('BPMN render error:', err);
        setError(err.message || 'Failed to render BPMN diagram');
      });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [xml, activeActivities]);

  if (error) {
    return (
      <div
        style={{
          width: '100%',
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4d4f',
          fontSize: 13,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height, background: '#fafafa' }}
    />
  );
}
