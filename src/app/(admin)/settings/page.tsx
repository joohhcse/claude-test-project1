"use client";

import { useState } from "react";

type Tab = "store" | "notifications" | "team" | "billing";

const tabs: { key: Tab; label: string }[] = [
  { key: "store", label: "스토어 정보" },
  { key: "notifications", label: "알림 설정" },
  { key: "team", label: "팀 관리" },
  { key: "billing", label: "결제" },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "viewer";
}

const initialMembers: TeamMember[] = [
  { id: "T1", name: "김대표", email: "ceo@shop.com", role: "owner" },
  { id: "T2", name: "이운영", email: "ops@shop.com", role: "admin" },
  { id: "T3", name: "박마케팅", email: "mkt@shop.com", role: "viewer" },
];

const roleLabel: Record<TeamMember["role"], string> = {
  owner: "소유자",
  admin: "관리자",
  viewer: "뷰어",
};

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("store");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

      {/* Horizontal tab menu */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "store" && <StoreInfoTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "team" && <TeamTab />}
      {tab === "billing" && <BillingTab />}
    </div>
  );
}

/* ─── Store Info Tab ─── */
function StoreInfoTab() {
  const [logo, setLogo] = useState<string | null>(null);
  const [currency, setCurrency] = useState("KRW");
  const [storeName, setStoreName] = useState("내 쇼핑몰");

  function handleLogoDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setLogo(url);
    }
  }

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setLogo(url);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-white p-6 space-y-5">
        <h2 className="font-semibold">기본 정보</h2>

        {/* Store name */}
        <div className="space-y-1">
          <label className="text-sm font-medium">스토어 이름</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Logo upload */}
        <div className="space-y-1">
          <label className="text-sm font-medium">브랜드 로고</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleLogoDrop}
            className="relative flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary"
          >
            {logo ? (
              <img
                src={logo}
                alt="Logo preview"
                className="h-full max-h-36 object-contain"
              />
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  이미지를 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, SVG (최대 2MB)
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-1">
          <label className="text-sm font-medium">통화 설정</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="KRW">KRW (₩) - 대한민국 원</option>
            <option value="USD">USD ($) - 미국 달러</option>
            <option value="JPY">JPY (¥) - 일본 엔</option>
            <option value="EUR">EUR (€) - 유로</option>
          </select>
        </div>
      </div>

      <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        저장
      </button>
    </div>
  );
}

/* ─── Notifications Tab ─── */
function NotificationsTab() {
  const [stockThreshold, setStockThreshold] = useState("10");
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-white p-6 space-y-5">
        <h2 className="font-semibold">재고 알림</h2>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            재고 부족 임계값 (개)
          </label>
          <input
            type="number"
            min="1"
            value={stockThreshold}
            onChange={(e) => setStockThreshold(e.target.value)}
            className="w-48 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            재고가 이 수량 이하로 떨어지면 알림을 보냅니다.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-6 space-y-4">
        <h2 className="font-semibold">알림 채널</h2>

        {/* Slack toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Slack 연동</p>
            <p className="text-xs text-muted-foreground">
              재고 부족, 신규 주문 알림을 Slack으로 전송합니다.
            </p>
          </div>
          <ToggleSwitch
            checked={slackEnabled}
            onChange={setSlackEnabled}
          />
        </div>

        {/* Email toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">이메일 연동</p>
            <p className="text-xs text-muted-foreground">
              주요 알림을 이메일로 전송합니다.
            </p>
          </div>
          <ToggleSwitch
            checked={emailEnabled}
            onChange={setEmailEnabled}
          />
        </div>
      </div>

      <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
        저장
      </button>
    </div>
  );
}

/* ─── Team Tab ─── */
function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<TeamMember["role"]>("viewer");

  function handleRoleChange(id: string, role: TeamMember["role"]) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m)),
    );
  }

  function handleAddMember() {
    if (!newName.trim() || !newEmail.trim()) return;
    const member: TeamMember = {
      id: `T${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
    };
    setMembers((prev) => [...prev, member]);
    setNewName("");
    setNewEmail("");
    setNewRole("viewer");
    setShowAddForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">팀 멤버</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {showAddForm ? "취소" : "멤버 추가"}
          </button>
        </div>

        {/* Add form */}
        {showAddForm && (
          <div className="mb-4 flex items-end gap-3 rounded-md border border-border bg-muted/30 p-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium">이름</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="홍길동"
                className="w-full rounded-md border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium">이메일</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@shop.com"
                className="w-full rounded-md border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-xs font-medium">권한</label>
              <select
                value={newRole}
                onChange={(e) =>
                  setNewRole(e.target.value as TeamMember["role"])
                }
                className="w-full rounded-md border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
              >
                <option value="admin">관리자</option>
                <option value="viewer">뷰어</option>
              </select>
            </div>
            <button
              onClick={handleAddMember}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              추가
            </button>
          </div>
        )}

        {/* Members list */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 font-medium">이름</th>
              <th className="pb-2 font-medium">이메일</th>
              <th className="pb-2 font-medium">권한</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0">
                <td className="py-3">{m.name}</td>
                <td className="py-3 text-muted-foreground">{m.email}</td>
                <td className="py-3">
                  {m.role === "owner" ? (
                    <span className="text-xs font-medium text-primary">
                      {roleLabel[m.role]}
                    </span>
                  ) : (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        handleRoleChange(
                          m.id,
                          e.target.value as TeamMember["role"],
                        )
                      }
                      className="rounded-md border border-border px-2 py-1 text-sm outline-none focus:border-primary"
                    >
                      <option value="admin">관리자</option>
                      <option value="viewer">뷰어</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Billing Tab ─── */
function BillingTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-white p-6 space-y-4">
        <h2 className="font-semibold">현재 플랜</h2>
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            Pro 플랜
          </div>
          <span className="text-sm text-muted-foreground">
            ₩49,000 / 월
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          다음 결제일: 2025년 6월 1일
        </p>
      </div>

      <div className="rounded-lg border border-border bg-white p-6 space-y-4">
        <h2 className="font-semibold">결제 수단</h2>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-12 items-center justify-center rounded border border-border bg-muted text-xs font-bold">
            VISA
          </div>
          <span className="text-sm">**** **** **** 4242</span>
          <span className="text-xs text-muted-foreground">만료: 12/26</span>
        </div>
        <button className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors">
          결제 수단 변경
        </button>
      </div>
    </div>
  );
}

/* ─── Toggle Switch ─── */
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
