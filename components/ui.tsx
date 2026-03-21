'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  CreditCard,
  History,
  ImagePlus,
  LogOut,
  Menu,
  MessageCircleMore,
  Plus,
  Upload,
  Wallet,
  X
} from 'lucide-react';
import {
  borderTypes,
  frameOptions,
  heroEvolutionRows,
  heroSkinOptions,
  paymentInfo,
  paymentPromotions,
  recentMerges
} from '@/lib/mock-data';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function getGuideTargetRect(step: number) {
  if (typeof window === 'undefined') return null;

  const selectors = [
    '[data-guide="quantity"]',
    '[data-guide="account-info"]',
    '[data-guide="overall-upload"]',
    '[data-guide="evo"]',
    '[data-guide="accessories"]',
    '[data-guide="top-upload"]',
    '[data-guide="winrate-upload"]',
    '[data-guide="border-type"]',
    '[data-guide="brightness"]',
    '[data-guide="merge-button"]',
    '[data-guide="merge-result"]',
    '[data-guide="support-note"]'
  ];

  const el = document.querySelector(selectors[step]);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom
  };
}

const assets = {
  renameCard: '/assets/static/media/the-doi-ten.8e03df02.png',
  accountCode: '/assets/static/media/account-code.e520dc9b.png',
  emblem: '/assets/static/media/emblem.f733a7a5.png',
  colorPaper: '/assets/static/media/color-paper.802fda39.png',
  defaultFrame: '/assets/static/media/default-frame.ca8a5178.webp',
  goldFrame: '/assets/static/media/gold-frame.0ce1fdf2.webp',
  overall: '/assets/static/media/overall.9094a821.webp',
  topHero: '/assets/static/media/tophero.1f2c265a.webp',
  winrate: '/assets/static/media/winrate.63608f93.webp',
  avatar1: '/assets/static/media/avatar1.c83c8f6d.png',
  avatar2: '/assets/static/media/avatar2.4a721353.png',
  avatar3: '/assets/static/media/avatar3.5944fa8f.png',
  appIcon: '/assets/icon-192x192.png'
};

export function AppShell({ children, active }: { children: ReactNode; active: 'merge' | 'history' | 'payment' }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[272px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col lg:justify-between">
          <div className="px-4 py-5">
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                  <Image src={assets.appIcon} alt="Tool icon" fill sizes="40px" className="object-cover" />
                </div>
                <div className="text-sm leading-tight">
                  <p className="font-semibold text-slate-900">Tool ghép ảnh</p>
                  <p className="text-xs text-slate-500">gheplienquan.com</p>
                </div>
              </div>
              <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700">
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1.5 text-[15px]">
              <SidebarLink href="/" active={active === 'merge'} icon={<ImagePlus className="h-4 w-4" />} label="Ghép ảnh" />
              <SidebarLink href="/history" active={active === 'history'} icon={<History className="h-4 w-4" />} label="Lịch sử ghép" />
              <SidebarLink href="/payment" active={active === 'payment'} icon={<Wallet className="h-4 w-4" />} label="Nạp tiền" />
              <a
                href="https://zalo.me/g/zbxyae446"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <MessageCircleMore className="h-4 w-4" />
                <span>Group Zalo Hỗ trợ</span>
              </a>
            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-white">
          <Topbar />
          <div className="px-4 pb-10 md:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <button className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full bg-[#1677ff] px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(22,119,255,0.28)] transition hover:bg-[#0f6cf0]">
        <MessageCircleMore className="h-4 w-4" />
        Mở cuộc trò chuyện
      </button>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
        active ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Topbar() {
  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm leading-6">
            <p>
              👋 <span className="font-medium">{paymentInfo.email}</span>
            </p>
            <p className="text-slate-600">
              Số dư: <span className="font-semibold text-slate-900">{paymentInfo.balance}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/payment"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1677ff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f6cf0]"
          >
            <Plus className="h-4 w-4" />
            Nạp
          </Link>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
            N. 3
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-2.5 flex min-h-6 items-center gap-2 text-[14px] font-medium leading-6 text-slate-700">
      <span>{children}</span>
      {hint}
    </div>
  );
}

function TextInput({ placeholder, type = 'text' }: { placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10"
    />
  );
}

function SelectInput({ options }: { options: string[] }) {
  return (
    <div className="relative">
      <select className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none transition focus:border-[#1677ff] focus:ring-4 focus:ring-[#1677ff]/10">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function UploadArea({ preview, compact = false }: { preview?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50',
        compact ? 'p-3.5' : 'p-4'
      )}
    >
      {preview ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className={cn('relative w-full bg-slate-100', compact ? 'aspect-[16/9]' : 'aspect-[16/9]')}>
            <Image
              src={preview}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-2"
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-[188px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
        <div className="mb-3 rounded-full bg-[#1677ff]/10 p-3 text-[#1677ff]">
          <Upload className="h-5 w-5" />
        </div>
        <p>
          Kéo và thả ảnh vào đây hoặc nhấn để <span className="font-semibold text-[#1677ff]">chọn ảnh</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">Hoặc dán ảnh từ clipboard (Cmd/Ctrl + V)</p>
        <p className="mt-1 text-xs text-slate-400">Hỗ trợ định dạng: (.jpg, .jpeg, .png)</p>
      </div>
    </div>
  );
}

function CheckRow({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-6 items-center gap-3 text-sm leading-6 text-slate-700">
      <input type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 rounded border-slate-300 text-[#1677ff] focus:ring-[#1677ff]" />
      <span>{label}</span>
    </label>
  );
}

function MiniStatInput({ icon, placeholder, type = 'text' }: { icon: string; placeholder: string; type?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
          <Image src={icon} alt="icon" fill sizes="36px" className="object-contain p-1.5" />
        </div>
        <TextInput placeholder={placeholder} type={type} />
      </div>
    </div>
  );
}

function RightSummary() {
  return (
    <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Thành tiền</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <span>-- ảnh</span>
              <span>✖</span>
              <span>150 ₫</span>
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="text-sm text-slate-500">Tổng cộng</span>
              <span className="text-3xl font-bold tracking-tight text-slate-900">--</span>
            </div>
          </div>

          <button data-guide="merge-button" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1677ff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6cf0]">
            <ImagePlus className="h-4 w-4" />
            Ghép Ảnh Tự Động
          </button>

          <div data-guide="merge-result" className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Ảnh ghép sẽ hiển thị ở đây sau khi hoàn thành.
          </div>

          <p data-guide="support-note" className="text-xs leading-6 text-slate-500">
            📌 Ghép không ưng, lỗi inb zalo 0835066924 để được hỗ trợ ghép lại/hoàn tiền
          </p>
        </div>
      </div>
    </aside>
  );
}

export function MergeFormClone() {
  const guideSteps = useMemo(
    () => [
      {
        title: 'Nhập số ảnh cần ghép',
        description: 'Hệ thống tự động canh chỉnh để ảnh ghép ra đẹp nhất.',
        note: 'Nhập số lượng ảnh bạn muốn ghép vào đây. Không có tối đa, nhưng tối thiểu là 10 ảnh nhen!'
      },
      {
        title: 'Nhập thông tin tài khoản',
        description: 'Hệ thống sẽ tự động lấy và ưu tiên skin xịn.'
      },
      {
        title: 'Upload ảnh tổng quan tài khoản',
        description: 'Hệ thống lấy số tướng/skin và cắt ava, rank, mác... tự động.',
        note: 'Các bạn chụp toàn bộ màn hình game cũng như dùng nền dễ nhìn để hạn chế AI lỗi nhận diện nhé!'
      },
      {
        title: 'Chọn bậc skin EVO',
        description: 'Hỗ trợ tất cả các bậc EVO (I đến V).'
      },
      {
        title: 'Chọn phụ kiện (nút bấm, hiệu ứng hạ, điệu nhảy...)',
        description: 'Hỗ trợ hầu hết các nút bấm, hiệu ứng hạ, điệu nhảy, vip 7 -> 10.'
      },
      {
        title: 'Upload ảnh top tướng',
        description: 'Hệ thống tự động lấy và sắp xếp các tướng theo thứ tự ưu tiên.',
        note: 'Các bạn chụp toàn bộ màn hình game để hạn chế AI bị lỗi nhận diện. Che tên tướng để bỏ không ghép vào ảnh nhé!'
      },
      {
        title: 'Upload ảnh tỉ lệ thắng',
        description: 'Hệ thống tự trích xuất và xếp theo số trận từ cao xuống thấp.',
        note: 'Các bạn chụp toàn bộ màn hình game để hạn chế AI bị lỗi nhận diện nhé!'
      },
      {
        title: 'Chọn loại khung',
        description: 'Hỗ trợ khung mặc định và khung vàng.'
      },
      {
        title: 'Chọn độ sáng ảnh ghép',
        description: 'Chỉnh theo sở thích của bạn nhen.'
      },
      {
        title: 'Bấm để ghép ảnh',
        description: 'Xong hết thì bấm nút này để ghép ảnh thui.'
      },
      {
        title: 'Kết quả ghép ảnh',
        description: 'Tada! Ảnh ghép xong sẽ hiện ở đây.'
      },
      {
        title: 'Hỗ trợ và báo lỗi',
        description: 'Liên hệ shop ngay nếu có vấn đề gì nhé!'
      }
    ],
    []
  );
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [guideAnchor, setGuideAnchor] = useState<ReturnType<typeof getGuideTargetRect>>(null);
  const currentGuide = guideSteps[guideStep];
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!guideOpen) return;

    const selectorMap = [
      '[data-guide="quantity"]',
      '[data-guide="account-info"]',
      '[data-guide="overall-upload"]',
      '[data-guide="evo"]',
      '[data-guide="accessories"]',
      '[data-guide="top-upload"]',
      '[data-guide="winrate-upload"]',
      '[data-guide="border-type"]',
      '[data-guide="brightness"]',
      '[data-guide="merge-button"]',
      '[data-guide="merge-result"]',
      '[data-guide="support-note"]'
    ];

    const updateAnchor = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = getGuideTargetRect(guideStep);
        setGuideAnchor((prev) => {
          if (
            prev &&
            rect &&
            Math.abs(prev.top - rect.top) < 1 &&
            Math.abs(prev.left - rect.left) < 1 &&
            Math.abs(prev.width - rect.width) < 1 &&
            Math.abs(prev.height - rect.height) < 1
          ) {
            return prev;
          }
          return rect;
        });
      });
    };

    const el = document.querySelector(selectorMap[guideStep]);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    updateAnchor();
    window.addEventListener('resize', updateAnchor, { passive: true });
    window.addEventListener('scroll', updateAnchor, { passive: true, capture: true });
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', updateAnchor);
      window.removeEventListener('scroll', updateAnchor, true);
    };
  }, [guideOpen, guideStep]);

  const guideCardStyle: CSSProperties | undefined = guideAnchor
    ? {
        position: 'fixed',
        top: Math.min(Math.max(16, guideAnchor.top), typeof window !== 'undefined' ? window.innerHeight - 220 : guideAnchor.top),
        left:
          typeof window !== 'undefined'
            ? guideAnchor.right + 16 + 345 > window.innerWidth
              ? Math.max(16, guideAnchor.left - 361)
              : guideAnchor.right + 16
            : guideAnchor.right + 16
      }
    : undefined;

  const guideHighlightStyle: CSSProperties | undefined = guideAnchor
    ? {
        position: 'fixed',
        top: Math.max(8, guideAnchor.top - 8),
        left: Math.max(8, guideAnchor.left - 8),
        width: guideAnchor.width + 16,
        height: guideAnchor.height + 16
      }
    : undefined;

  const overlayRects = guideHighlightStyle && typeof window !== 'undefined'
    ? {
        top: {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: guideHighlightStyle.top as number
        },
        left: {
          top: guideHighlightStyle.top as number,
          left: 0,
          width: guideHighlightStyle.left as number,
          height: guideHighlightStyle.height as number
        },
        right: {
          top: guideHighlightStyle.top as number,
          left: (guideHighlightStyle.left as number) + (guideHighlightStyle.width as number),
          width: window.innerWidth - ((guideHighlightStyle.left as number) + (guideHighlightStyle.width as number)),
          height: guideHighlightStyle.height as number
        },
        bottom: {
          top: (guideHighlightStyle.top as number) + (guideHighlightStyle.height as number),
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight - ((guideHighlightStyle.top as number) + (guideHighlightStyle.height as number))
        }
      }
    : null;

  return (
    <>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-6">
          <div className="space-y-7">
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-slate-900">Ghép Ảnh</h1>

            <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 md:items-start">
              <div data-guide="quantity" className="space-y-0.5">
                <FieldLabel>Số lượng ảnh ghép</FieldLabel>
                <TextInput type="number" />
              </div>
              <div data-guide="account-info" className="space-y-0.5">
                <FieldLabel>Thông tin tài khoản</FieldLabel>
                <div className="grid gap-3">
                  <TextInput placeholder="Tên tài khoản" />
                  <TextInput placeholder="Mật khẩu" type="password" />
                </div>
              </div>
            </div>

            <div className="space-y-0.5">
              <FieldLabel>Chọn khung hình</FieldLabel>
              <SelectInput options={frameOptions} />
            </div>

            <div data-guide="overall-upload" className="space-y-0.5">
              <FieldLabel hint={<span className="text-xs font-normal text-[#1677ff]">(Xem ảnh mẫu)</span>}>
                Ảnh tổng quan tài khoản
              </FieldLabel>
              <UploadArea preview={assets.overall} />
            </div>

            <div className="grid gap-x-4 gap-y-2 md:grid-cols-2 md:items-center">
              <CheckRow label="Ghép ảnh tổng phía trên" />
              <CheckRow label="Đổi avatar" />
            </div>

            <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 md:items-start">
              <MiniStatInput icon={assets.renameCard} placeholder="Số thẻ đổi tên (nếu có)" type="number" />
              <MiniStatInput icon={assets.accountCode} placeholder="Mã số tài khoản (nếu có)" />
            </div>

            <div className="space-y-3.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4.5">
              <CheckRow label="🧰 Đạo cụ thêm (quân huy, giấy cuộn tuyệt sắc)" />
              <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 md:items-start">
                <MiniStatInput icon={assets.emblem} placeholder="Số quân huy" type="number" />
                <MiniStatInput icon={assets.colorPaper} placeholder="Giấy cuộn tuyệt sắc" type="number" />
              </div>
            </div>

            <div className="space-y-3.5" data-guide="evo">
              <FieldLabel>Trang phục tiến hoá (Chọn nếu có)</FieldLabel>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:items-start">
                {heroEvolutionRows.map((hero) => (
                  <div key={hero} className="space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="text-sm font-medium text-slate-700">{hero}</div>
                    <SelectInput options={heroSkinOptions} />
                  </div>
                ))}
              </div>
            </div>

            <div data-guide="accessories" className="space-y-0.5">
              <FieldLabel>Phụ kiện (nút bấm, hiệu ứng hạ, điệu nhảy...)</FieldLabel>
              <button className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-500 transition hover:border-slate-300">
                <span>Chọn phụ kiện (nút bấm, hiệu ứng hạ, điệu nhảy...)</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-0.5">
              <div className="mb-2.5 flex min-h-6 items-center gap-2">
                <FieldLabel>Hiển thị đầy đủ trang phục tướng chỉ định</FieldLabel>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">🤩 Mới</span>
              </div>
              <button className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-500 transition hover:border-slate-300">
                <span>Chọn tướng để hiển thị đầy đủ trang phục (nếu có)</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 md:items-start">
              <div data-guide="top-upload" className="space-y-0.5">
                <FieldLabel hint={<span className="text-xs font-normal text-[#1677ff]">(Xem ảnh mẫu)</span>}>
                  Ảnh TOP tướng (Nếu có)
                </FieldLabel>
                <UploadArea preview={assets.topHero} compact />
              </div>

              <div className="space-y-3.5" data-guide="winrate-upload">
                <div>
                  <FieldLabel hint={<span className="text-xs font-normal text-[#1677ff]">(Xem ảnh mẫu)</span>}>
                    Ảnh tỉ lệ thắng (Nếu có)
                  </FieldLabel>
                  <UploadArea preview={assets.winrate} compact />
                </div>
                <CheckRow label="Chỉ lấy tướng có tỉ lệ thắng trên 52%" />
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
              <div data-guide="border-type" className="space-y-0.5">
                <FieldLabel>Chọn loại viền</FieldLabel>
                <div className="grid gap-3.5 md:grid-cols-2 md:items-start">
                  <FrameOption title={borderTypes[0]} image={assets.defaultFrame} active />
                  <FrameOption title={borderTypes[1]} image={assets.goldFrame} />
                </div>
              </div>

              <div className="space-y-3.5" data-guide="brightness">
                <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>Độ sáng ảnh:</span>
                  <span className="text-slate-500">Mặc định</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={0} className="ghep-range w-full" />
              </div>
            </div>

            <div className="space-y-0.5">
              <FieldLabel>Mẫu tham khảo</FieldLabel>
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-3">
                <div className="relative aspect-[16/10] w-full rounded-[18px] bg-slate-100">
                  <Image
                    src={assets.goldFrame}
                    alt="Frame"
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-contain p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={() => {
            setGuideStep(0);
            setGuideOpen(true);
          }}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Xem lại hướng dẫn ghép ảnh
        </button>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900">Ghép Gần Đây</h2>
          <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            {recentMerges.length === 0 ? (
              <>
                <p className="text-lg font-semibold text-slate-700">Trống</p>
                <p className="mt-2 text-sm text-slate-500">Các ảnh mới ghép sẽ xuất hiện ở đây</p>
              </>
            ) : null}
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">Tool ghép ảnh liên quân © 2026</p>
        </section>
      </div>

      <RightSummary />
    </div>

    {guideOpen ? (
      <div className="fixed inset-0 z-50">
        <button type="button" aria-label="Đóng overlay" onClick={() => setGuideOpen(false)} className="absolute inset-0 h-full w-full cursor-default bg-transparent" />
        {overlayRects ? (
          <>
            <div className="pointer-events-none fixed bg-black/45" style={overlayRects.top} />
            <div className="pointer-events-none fixed bg-black/45" style={overlayRects.left} />
            <div className="pointer-events-none fixed bg-black/45" style={overlayRects.right} />
            <div className="pointer-events-none fixed bg-black/45" style={overlayRects.bottom} />
          </>
        ) : (
          <div className="pointer-events-none fixed inset-0 bg-black/45" />
        )}
        {guideHighlightStyle ? (
          <div
            className="pointer-events-none fixed rounded-lg border-2 border-white bg-transparent"
            style={{
              ...guideHighlightStyle,
              willChange: 'transform, top, left, width, height'
            }}
          />
        ) : null}
        <div className="pointer-events-auto w-[calc(100%-2rem)] max-w-[345px] rounded-md border border-[#dcdcdc] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.22)]" style={{ ...guideCardStyle, willChange: 'transform, top, left' }}>
          <button
            onClick={() => setGuideOpen(false)}
            className="absolute right-2 top-2 rounded-sm p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng hướng dẫn"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="px-5 pb-4 pt-5">
            <p className="pr-5 text-[15px] font-semibold leading-6 text-slate-900">{currentGuide.title}</p>
            <p className="mt-1 text-[13px] italic leading-5 text-slate-400">{currentGuide.description}</p>
            {currentGuide.note ? <p className="mt-4 text-[13px] leading-6 text-slate-700">{currentGuide.note}</p> : null}

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                {guideStep > 0 ? (
                  <button
                    onClick={() => setGuideStep((prev) => Math.max(0, prev - 1))}
                    className="text-[13px] text-slate-700 transition hover:text-black"
                  >
                    Quay lại
                  </button>
                ) : null}
                {guideStep < guideSteps.length - 1 ? (
                  <button
                    onClick={() => setGuideOpen(false)}
                    className="text-[13px] text-slate-700 transition hover:text-black"
                  >
                    Bỏ qua
                  </button>
                ) : null}
              </div>

              {guideStep < guideSteps.length - 1 ? (
                <button
                  onClick={() => setGuideStep((prev) => Math.min(guideSteps.length - 1, prev + 1))}
                  className="rounded-sm bg-black px-3 py-2 text-[13px] font-medium text-white transition hover:bg-slate-800"
                >
                  Bước tiếp theo ({guideStep + 1}/{guideSteps.length})
                </button>
              ) : (
                <button
                  onClick={() => setGuideOpen(false)}
                  className="rounded-sm bg-black px-3 py-2 text-[13px] font-medium text-white transition hover:bg-slate-800"
                >
                  Đã hiểu, bắt đầu ghép ảnh!
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}

function FrameOption({ title, image, active = false }: { title: string; image: string; active?: boolean }) {
  return (
    <button
      className={cn(
        'overflow-hidden rounded-2xl border bg-white text-left transition',
        active ? 'border-[#1677ff] shadow-[0_0_0_4px_rgba(22,119,255,0.08)]' : 'border-slate-200 hover:border-slate-300'
      )}
    >
      <div className="relative aspect-[16/10] w-full bg-slate-100">
        <Image src={image} alt={title} fill sizes="300px" className="object-contain p-2" />
      </div>
      <div className="space-y-1 px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-[#1677ff]">Click xem ảnh mẫu</p>
      </div>
    </button>
  );
}

export function HistoryClone() {
  return (
    <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-slate-900">Lịch sử ghép</h1>
        <Link href="/" className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Quay lại ghép ảnh
        </Link>
      </div>

      <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <p className="text-lg font-semibold text-slate-700">Trống</p>
        <p className="mt-2 text-sm text-slate-500">Các ảnh mới ghép sẽ xuất hiện ở đây</p>
      </div>
    </div>
  );
}

export function PaymentClone() {
  return (
    <div className="mt-6 space-y-6">
      <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-slate-900">Nạp tiền</h1>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Nạp tiền tự động qua QR</h2>
          <div className="mt-5 flex aspect-square items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            QR thanh toán
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <CreditCard className="h-4 w-4" />
            Tải mã QR
          </button>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Thông Tin Chuyển Khoản</h2>
            <div className="mt-5 grid gap-4">
              <InfoRow label="Ngân hàng:" value={paymentInfo.bankName} />
              <InfoRow label="Số tài khoản:" value={paymentInfo.accountNumber} />
              <InfoRow label="Chủ tài khoản:" value={paymentInfo.accountHolder} />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">*[Quan Trọng] Nội dung chuyển khoản (bắt buộc ghi đúng nội dung sau):</p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xl font-bold tracking-[0.18em] text-slate-900">{paymentInfo.transferCode}</p>
                  <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                    Sao chép nội dung chuyển khoản
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Vui lòng nạp tối thiểu 10k, nạp dưới 10k sẽ bị <span className="font-semibold text-amber-600">trừ 1000đ</span> phí giao dịch.
              </p>
              <p className="text-sm text-slate-500">Sau khi chuyển khoản, vui lòng chờ trong vòng 5 phút để hệ thống cập nhật số dư của bạn.</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-6">
            <h2 className="text-lg font-semibold text-slate-900">🔥 Chương Trình Khuyến Mãi Nạp Tiền 🔥</h2>
            <p className="mt-2 text-sm text-slate-500">Nhận khuyến mãi hấp dẫn khi nạp tiền theo các mốc dưới đây:</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {paymentPromotions.map((item) => (
                <div key={item.amount} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm text-slate-500">Nạp</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{item.amount}</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-600">{item.bonus}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">*Ví dụ: Khi bạn nạp 1,000,000đ, bạn sẽ nhận được 1,200,000đ trong tài khoản.</p>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Lịch Sử Giao Dịch</h2>
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
              Chưa có giao dịch nào.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
