'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type GridBlock,
  createEmptyBlock, defaultGrid, getOptimalColumns, buildDisplayGrid, buildBlocksFromAccountData,
} from '@/lib/layout-utils';
import { API_URL, API_TOKEN, proxyImg, apiGet } from '@/lib/api-client';

const fetchHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
};

// ---------- Sub-components ----------

function ToolItem({
  label,
  imgSrc,
  type,
  file,
  w,
  onDragStart,
}: {
  label: string;
  imgSrc: string;
  type: string;
  file?: string;
  w: number;
  onDragStart: (data: { type: string; file?: string; w: number }) => void;
}) {
  return (
    <div
      className="ce-tool-item"
      draggable
      onDragStart={() => onDragStart({ type, file, w })}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={label} />
      ) : (
        <div className="ce-cell-label" style={{ width: 40, height: 40, borderRadius: 6, fontSize: 8 }}>{type}</div>
      )}
      <span>{label}</span>
    </div>
  );
}


// ---------- Settings Modal ----------

function SettingsModal({
  block,
  onSave,
  onRemove,
  onClose,
}: {
  block: GridBlock | null;
  onSave: (patch: Partial<GridBlock>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const [colSpan, setColSpan] = useState(1);
  const [badge, setBadge] = useState('');
  const [heroCount, setHeroCount] = useState(0);
  const [skinCount, setSkinCount] = useState(0);

  useEffect(() => {
    if (block) {
      setColSpan(block.w);
      setBadge(block.badge || '');
      setHeroCount(block.heroCount || 0);
      setSkinCount(block.skinCount || 0);
    }
  }, [block]);

  if (!block) return null;

  return (
    <div className="ce-modal active">
      <div className="ce-modal-content">
        <h3>Chỉnh sửa ô</h3>
        <div className="ce-form-group">
          <label>Độ rộng (Cột)</label>
          <input type="number" min={1} max={20} value={colSpan} onChange={(e) => setColSpan(Number(e.target.value))} />
        </div>
        <div className="ce-form-group" style={{ marginTop: 10 }}>
          <label>Huy Hiệu (Badge)</label>
          <select value={badge} onChange={(e) => setBadge(e.target.value)} className="ce-select">
            <option value="">-- Không có --</option>
            <option value="T2limited.png">SSS Hữu Hạn</option>
          </select>
        </div>
        {block.type === 'profile' && (
          <div style={{ marginTop: 10 }}>
            <div className="ce-form-group">
              <label>Số lượng Tướng</label>
              <input type="number" value={heroCount} onChange={(e) => setHeroCount(Number(e.target.value))} />
            </div>
            <div className="ce-form-group" style={{ marginTop: 10 }}>
              <label>Số lượng Skin</label>
              <input type="number" value={skinCount} onChange={(e) => setSkinCount(Number(e.target.value))} />
            </div>
          </div>
        )}
        <div className="ce-modal-actions">
          <button className="ce-btn ce-btn-danger" onClick={onRemove}>Xóa ảnh</button>
          <button className="ce-btn ce-btn-secondary" onClick={onClose}>Đóng</button>
          <button
            className="ce-btn ce-btn-primary"
            onClick={() => onSave({ w: colSpan, badge: badge || null, heroCount, skinCount })}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Grid Cell ----------

function GridCell({
  block,
  index,
  onDrop,
  onDragStart,
  onSettings,
  onRemoveEmpty,
}: {
  block: GridBlock;
  index: number;
  onDrop: (index: number) => void;
  onDragStart: (data: { type: string; file?: string; w: number; badge?: string | null; sourceIndex: number }) => void;
  onSettings: (index: number) => void;
  onRemoveEmpty: (index: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const isEmpty = block.type === 'empty';

  return (
    <div
      className={`ce-grid-cell${!isEmpty ? ' filled' : ''}${dragOver ? ' drag-over' : ''}`}
      style={{ gridColumn: `span ${block.w}` }}
      draggable={!isEmpty}
      onDragStart={(e) => {
        if (isEmpty) { e.preventDefault(); return; }
        onDragStart({ type: block.type, file: block.file, w: block.w, badge: block.badge, sourceIndex: index });
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); onDrop(index); }}
    >
      {!isEmpty && block.type === 'overall' ? (
        <img className="ce-overall-img" src={proxyImg(`/images/assets/${encodeURIComponent(block.file || '')}`)} alt="overall" />
      ) : !isEmpty && block.type === 'accessories' ? (
        <div className="ce-accessories-cell">
          <div className="ce-acc-item">
            <img src={proxyImg('/images/assets/emblem.png')} alt="" />
            <span>{block.emblemCount || 0}</span>
          </div>
          <div className="ce-acc-item">
            <img src={proxyImg('/images/assets/color-paper.png')} alt="" />
            <span>{block.scrollCount || 0}</span>
          </div>
        </div>
      ) : !isEmpty && block.type === 'profile' ? (
        <div className="ce-profile-block-preview">
          <div className="ce-stats-side">
            <div className="ce-stat-box">
              <img src={proxyImg('/images/assets/tuong1.png')} alt="" />
              <div className="ce-txt"><span>Tướng</span><strong>{block.heroCount || 0}</strong></div>
            </div>
            <div className="ce-stat-box">
              <img src={proxyImg('/images/assets/skin1.png')} alt="" />
              <div className="ce-txt"><span>Trang phục</span><strong>{block.skinCount || 0}</strong></div>
            </div>
          </div>
          <div className="ce-right-wrap">
            <img src={proxyImg('/images/assets/custom_1776058497850_z7720356286845_f25ead227b91037983e770c90be77364.jpg')} alt="" />
            <img className="ce-rename-card" src={proxyImg('/images/assets/the-doi-ten.png')} alt="" />
          </div>
        </div>
      ) : !isEmpty && block.type === 'asset' ? (
        <img src={proxyImg(`/images/assets/${encodeURIComponent(block.file || '')}`)} alt="" />
      ) : !isEmpty && block.type === 'skin' ? (
        <img src={proxyImg(block.imageUrl || '')} alt="" />
      ) : null}

      {!isEmpty && block.badge && (
        <img className="ce-badge-overlay" src={proxyImg(`/images/assets/${encodeURIComponent(block.badge)}`)} alt="" />
      )}

      {!isEmpty && (
        <div className="ce-cell-overlay">
          <div className="ce-btn-drag">☩</div>
          <div className="ce-btn-set" onClick={(e) => { e.stopPropagation(); onSettings(index); }}>⚙</div>
        </div>
      )}
      {isEmpty && (
        <div className="ce-empty-remove" onClick={() => onRemoveEmpty(index)} title="Xóa ô trống">✕</div>
      )}
    </div>
  );
}

// ---------- Main Editor Component ----------

export default function CollageEditor() {
  const [gridBlocks, setGridBlocks] = useState<GridBlock[]>(defaultGrid);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [customTools, setCustomTools] = useState<{ file: string; w: number }[]>([]);
  const [accountInput, setAccountInput] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState<{ username: string; heroes_count: number; skins_count: number; total_matched: number } | null>(null);
  const [emblemCount, setEmblemCount] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);
  const [overallFile, setOverallFile] = useState<string | null>(null);
  const [accountSkins, setAccountSkins] = useState<{ name: string; url: string }[]>([]);
  const overallUploadRef = useRef<HTMLInputElement>(null);
  const dragDataRef = useRef<{ type: string; file?: string; w: number; badge?: string | null; sourceIndex?: number } | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);


  // Pre-load from localStorage (when navigating from main form)
  useEffect(() => {
    const stored = localStorage.getItem('editorData');
    if (!stored) return;
    try {
      const data = JSON.parse(stored);
      setAccountInput(data.username || '');
      setEmblemCount(data.emblemCount || 0);
      setScrollCount(data.scrollCount || 0);
      if (data.overallFile) setOverallFile(data.overallFile);
      if (data.skins?.length) {
        setGridBlocks(buildBlocksFromAccountData(data, {
          overallFile: data.overallFile,
          emblemCount: data.emblemCount || 0,
          scrollCount: data.scrollCount || 0,
        }));
        setAccountInfo({
          username: data.username,
          heroes_count: data.heroes_count,
          skins_count: data.skins_count,
          total_matched: data.total_matched,
        });
        setAccountSkins((data.skins || []).map((s: { t: string }) => ({ name: s.t, url: `/img/t/${s.t}` })));
      }
      localStorage.removeItem('editorData');
    } catch { /* ignore */ }
  }, []);

  // Sync emblem/scroll counts into the accessories block
  useEffect(() => {
    setGridBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === 'b_accessories');
      if (idx === -1) return prev;
      const current = prev[idx];
      if (current.emblemCount === emblemCount && current.scrollCount === scrollCount) return prev;
      const next = [...prev];
      next[idx] = { ...current, emblemCount, scrollCount };
      return next;
    });
  }, [emblemCount, scrollCount]);

  // Sync overall image into gridBlocks
  useEffect(() => {
    setGridBlocks((prev) => {
      const hasOverall = prev.some((b) => b.type === 'overall');
      if (overallFile && !hasOverall) {
        return [{ id: 'b_overall', type: 'overall' as const, file: overallFile, w: 1 }, ...prev];
      }
      if (overallFile && hasOverall) {
        return prev.map((b) => b.id === 'b_overall' ? { ...b, file: overallFile } : b);
      }
      if (!overallFile && hasOverall) {
        return prev.filter((b) => b.type !== 'overall');
      }
      return prev;
    });
  }, [overallFile]);

  // Upload overall image
  const handleOverallUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64data = ev.target?.result;
      const newFilename = 'overall_' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      try {
        const res = await fetch(`${API_URL}/api/upload-asset`, {
          method: 'POST',
          headers: fetchHeaders,
          body: JSON.stringify({ filename: newFilename, filedata: base64data }),
        });
        const data = await res.json();
        if (data.success) setOverallFile(data.filename);
        else alert('Lỗi upload: ' + data.error);
      } catch { alert('Lỗi khi tải ảnh lên!'); }
    };
    reader.readAsDataURL(file);
    if (overallUploadRef.current) overallUploadRef.current.value = '';
  };

  // Load account skins
  const handleLoadAccount = async () => {
    const username = accountInput.trim();
    if (!username) return;
    setAccountLoading(true);
    setAccountInfo(null);
    try {
      const { ok, data } = await apiGet(`/api/account-skins?username=${encodeURIComponent(username)}`);
      if (!ok) {
        alert(data?.error || 'Lỗi tải tài khoản');
        return;
      }
      setAccountInfo({ username: data.username, heroes_count: data.heroes_count, skins_count: data.skins_count, total_matched: data.total_matched });
      // Save account skins for Auto Fill
      setAccountSkins((data.skins || []).map((s: { t: string }) => ({ name: s.t, url: `/img/t/${s.t}` })));
      setGridBlocks(buildBlocksFromAccountData(data, { overallFile, emblemCount, scrollCount }));
    } catch (err: unknown) {
      alert('Lỗi kết nối BE: ' + (err instanceof Error ? err.message : err));
    } finally {
      setAccountLoading(false);
    }
  };


  const columns = getOptimalColumns(gridBlocks);
  const displayGrid = buildDisplayGrid(gridBlocks, columns);

  const handleToolDragStart = useCallback((data: { type: string; file?: string; w: number }) => {
    dragDataRef.current = data;
  }, []);

  const handleCellDragStart = useCallback((data: { type: string; file?: string; w: number; badge?: string | null; sourceIndex: number }) => {
    dragDataRef.current = data;
  }, []);

  const handleDrop = useCallback((index: number) => {
    const data = dragDataRef.current;
    if (!data) return;

    setGridBlocks((prev) => {
      const next = [...prev];
      if (data.sourceIndex !== undefined) {
        const temp = next[index];
        next[index] = next[data.sourceIndex];
        next[data.sourceIndex] = temp;
      } else {
        next[index] = { ...next[index], type: data.type as GridBlock['type'], file: data.file, w: data.w };
      }
      return next;
    });
    dragDataRef.current = null;
  }, []);

  const handleReset = () => {
    if (confirm('Tạo lại khung trắng cơ bản?')) setGridBlocks(defaultGrid());
  };

  const handleAutoFill = () => {
    if (!accountSkins.length) {
      alert('Vui lòng tải tài khoản trước');
      return;
    }
    const existing = new Set(gridBlocks.filter(b => b.type === 'skin').map(b => b.file));
    const newSkins = accountSkins.filter(s => !existing.has(s.name));
    if (!newSkins.length) return;
    setGridBlocks((prev) => [
      ...prev,
      ...newSkins.map((s, i) => ({ id: 'af_' + i, type: 'skin' as const, file: s.name, imageUrl: s.url, w: 1 })),
    ]);
  };


  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns, layout: displayGrid }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Thành công! Ảnh đã được lưu: ${data.file}`);
      } else {
        alert(`Lỗi: ${data.error}`);
      }
    } catch (err: unknown) {
      alert('Lỗi kết nối: ' + (err instanceof Error ? err.message : err));
    } finally {
      setExporting(false);
    }
  };

  const handleUpload = () => uploadRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const widthStr = prompt(`Ảnh "${file.name}" sẽ chiếm bao nhiêu cột? (1-20)`, '1');
    const w = parseInt(widthStr || '0');
    if (isNaN(w) || w <= 0 || w > 20) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64data = ev.target?.result;
      const newFilename = 'custom_' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      try {
        const res = await fetch(`${API_URL}/api/upload-asset`, {
          method: 'POST',
          headers: fetchHeaders,
          body: JSON.stringify({ filename: newFilename, filedata: base64data }),
        });
        const data = await res.json();
        if (data.success) {
          setCustomTools((prev) => [...prev, { file: data.filename, w }]);
        } else {
          alert('Lỗi upload: ' + data.error);
        }
      } catch {
        alert('Lỗi khi tải ảnh lên!');
      }
    };
    reader.readAsDataURL(file);
    if (uploadRef.current) uploadRef.current.value = '';
  };

  const handleSaveCell = (patch: Partial<GridBlock>) => {
    if (editIndex === null) return;
    setGridBlocks((prev) => {
      const next = [...prev];
      next[editIndex] = { ...next[editIndex], ...patch };
      return next;
    });
    setEditIndex(null);
  };

  const handleRemoveCell = () => {
    if (editIndex === null) return;
    setGridBlocks((prev) => {
      const next = [...prev];
      if (next[editIndex].type === 'empty') {
        next.splice(editIndex, 1);
      } else {
        next[editIndex] = createEmptyBlock();
      }
      return next;
    });
    setEditIndex(null);
  };

  // Built-in tools
  const builtinTools = [
    { label: 'Avatar/Rank (1x1)', img: proxyImg('/images/assets/avatar1.png'), type: 'asset', file: 'avatar1.png', w: 1 },
    { label: 'Danh Hiệu (2x1)', img: proxyImg('/images/assets/tophero.webp'), type: 'asset', file: 'tophero.webp', w: 2 },
    { label: 'Danh Hiệu (3x1)', img: proxyImg('/images/assets/tophero.webp'), type: 'asset', file: 'tophero.webp', w: 3 },
    { label: 'Thông Số (5x1)', img: proxyImg('/images/assets/winrate.webp'), type: 'asset', file: 'winrate.webp', w: 5 },
    { label: 'Yêu Thích (2x1)', img: proxyImg('/images/assets/winrate.webp'), type: 'asset', file: 'winrate.webp', w: 2 },
    { label: 'Hồ Sơ (4x1)', img: proxyImg('/images/assets/winrate.webp'), type: 'profile', file: undefined, w: 4 },
  ];

  return (
    <div className="ce-app">
      {/* Sidebar */}
      <aside className="ce-sidebar">
        <div className="ce-sidebar-header">
          <h2>Collage Editor</h2>
          <p>Khung cố định ({columns} Cột)</p>
        </div>

        <div className="ce-tools-panel">
          {/* Account Input */}
          <div className="ce-account-section">
            <h3>Tải Tài Khoản</h3>
            <div className="ce-account-row">
              <input
                type="text"
                placeholder="Nhập username..."
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadAccount()}
                className="ce-account-input"
              />
              <button className="ce-btn ce-btn-primary ce-btn-load" onClick={handleLoadAccount} disabled={accountLoading}>
                {accountLoading ? '...' : 'Load'}
              </button>
            </div>
            {accountInfo && (
              <div className="ce-account-info">
                <span>{accountInfo.username}</span>
                <span>{accountInfo.heroes_count} tướng</span>
                <span>{accountInfo.total_matched} skin</span>
              </div>
            )}
            <div className="ce-acc-inputs">
              <div className="ce-acc-input-row">
                <img src={proxyImg('/images/assets/emblem.png')} alt="emblem" />
                <input type="number" min={0} placeholder="0" value={emblemCount || ''} onChange={(e) => setEmblemCount(Number(e.target.value) || 0)} />
                <span>Quân huy</span>
              </div>
              <div className="ce-acc-input-row">
                <img src={proxyImg('/images/assets/color-paper.png')} alt="scroll" />
                <input type="number" min={0} placeholder="0" value={scrollCount || ''} onChange={(e) => setScrollCount(Number(e.target.value) || 0)} />
                <span>Giấy cuộn</span>
              </div>
            </div>
          </div>

          {/* Overall image upload */}
          <div className="ce-account-section">
            <h3>Ảnh Tổng Quan</h3>
            {overallFile ? (
              <div className="ce-overall-preview">
                <img src={proxyImg(`/images/assets/${encodeURIComponent(overallFile)}`)} alt="overall" style={{ width: '100%', borderRadius: 6 }} />
                <button className="ce-btn ce-btn-danger ce-btn-sm" onClick={() => setOverallFile(null)}>Xoá</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="ce-btn ce-btn-secondary" style={{ flex: 1 }} onClick={() => overallUploadRef.current?.click()}>
                  + Tải ảnh
                </button>
                <button className="ce-btn ce-btn-primary" style={{ flex: 1 }} onClick={() => setOverallFile('overall.webp')}>
                  Ảnh mẫu
                </button>
              </div>
            )}
            <input ref={overallUploadRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleOverallUpload} />
          </div>

          <div className="ce-tools-header">
            <h3>Thêm Phần Tử</h3>
            <button className="ce-btn ce-btn-secondary ce-btn-sm" onClick={handleUpload}>+ Tải Ảnh Lên</button>
            <input ref={uploadRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelected} />
          </div>

          <div className="ce-tool-list">
            {builtinTools.map((t, i) => (
              <ToolItem key={i} label={t.label} imgSrc={t.img} type={t.type} file={t.file} w={t.w} onDragStart={handleToolDragStart} />
            ))}
            {customTools.map((t, i) => (
              <ToolItem
                key={`custom-${i}`}
                label={`Custom (${t.w}x1)`}
                imgSrc={proxyImg(`/images/assets/${encodeURIComponent(t.file)}`)}
                type="asset"
                file={t.file}
                w={t.w}
                onDragStart={handleToolDragStart}
              />
            ))}
          </div>

{/* Skin list hidden for security */}
        </div>

        <div className="ce-sidebar-footer">
          <button className="ce-btn ce-btn-primary" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Đang tạo ảnh...' : 'Export Config & Generate'}
          </button>
        </div>
      </aside>

      {/* Workspace */}
      <main className="ce-workspace" onContextMenu={(e) => e.preventDefault()}>
        <div className="ce-workspace-header">
          <div className="ce-actions">
            <button className="ce-btn ce-btn-secondary" onClick={handleReset}>Reset Khung</button>
            <button className="ce-btn ce-btn-secondary" onClick={handleAutoFill} disabled={!accountSkins.length}>Auto Điền Skin</button>
          </div>
        </div>

        <div className="ce-canvas-wrapper">
          <div className="ce-collage-frame" style={{ width: columns * 50 + (columns - 1) * 3 + 6 }}>
            {overallFile && (
              <img
                className="ce-overall-top"
                src={proxyImg(`/images/assets/${encodeURIComponent(overallFile)}`)}
                alt="overall"
              />
            )}
            <div
              className="ce-grid-canvas"
              style={{ gridTemplateColumns: `repeat(${columns}, 50px)`, gridAutoRows: '68px' }}
            >
              {displayGrid.filter((b) => b.type !== 'overall').map((block, i) => (
                <GridCell
                  key={block.id + '_' + i}
                  block={block}
                  index={i}
                  onDrop={handleDrop}
                  onDragStart={handleCellDragStart}
                  onSettings={setEditIndex}
                  onRemoveEmpty={(idx) => setGridBlocks(prev => prev.filter((_, j) => j !== idx))}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {editIndex !== null && displayGrid[editIndex] && (
        <SettingsModal
          block={displayGrid[editIndex]}
          onSave={handleSaveCell}
          onRemove={handleRemoveCell}
          onClose={() => setEditIndex(null)}
        />
      )}
    </div>
  );
}
