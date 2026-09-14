import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Filter,
  Key,
  KeyRound,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
  XCircle,
  BookOpen
} from "lucide-react";
import { Logo } from "../Logo";
import type { Applicant, SavedPassword } from "../../types/admin";
import {
  addSavedPassword,
  deleteApplicant,
  deleteSavedPassword,
  fetchApplicantsFromSupabase,
  generateRandomPassword,
  hasAdminUserOnServer,
  setupAdmin,
  verifyLogin,
  getApplicants,
  getSavedPasswords,
  updateAdminPassword,
  updateApplicantStatus,
} from "../../utils/adminStorage";
import { AdminCourses } from "./AdminCourses";

interface AdminPanelProps {
  onBackToSite?: () => void;
}

export function AdminPanel({ onBackToSite }: AdminPanelProps) {
  // Auth state
  const [authStatus, setAuthStatus] = useState<"loading" | "setup" | "login" | "authenticated">("loading");
  
  useEffect(() => {
    hasAdminUserOnServer().then((exists) => {
      setAuthStatus(exists ? "login" : "setup");
    });
  }, []);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab state: "applicants" | "passwords" | "settings" | "courses"
  const [activeTab, setActiveTab] = useState<"applicants" | "passwords" | "settings" | "courses">("applicants");

  // Data states
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [passwords, setPasswords] = useState<SavedPassword[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Filter / Search states for applicants
  const [applicantSearch, setApplicantSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Password Generator states
  const [genLength, setGenLength] = useState(16);
  const [generatedPass, setGeneratedPass] = useState("");


  // New Credential Form
  const [showAddPassModal, setShowAddPassModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCategory, setNewCategory] = useState<SavedPassword["category"]>("Other");

  // Visible password toggles
  const [visiblePassIds, setVisiblePassIds] = useState<Record<string, boolean>>({});

  // Change Admin Password state
  const [currentPass, setCurrentPass] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [confirmAdminPass, setConfirmAdminPass] = useState("");
  const [passChangeMsg, setPassChangeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Toast / Notification banner
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      setApplicants(getApplicants());
      fetchApplicantsFromSupabase().then((data) => setApplicants(data));
      setPasswords(getSavedPasswords());
      setGeneratedPass(generateRandomPassword(16));
    }
  }, [authStatus]);

  // Handle Setup
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await setupAdmin(loginUser, loginPass);
      setAuthStatus("authenticated");
    } catch (err: any) {
      setLoginError(err.message === "ADMIN_EXISTS" ? "An admin already exists." : "Setup failed. Make sure your server is running.");
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const success = await verifyLogin(loginUser, loginPass);
    if (success) {
      setAuthStatus("authenticated");
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthStatus("login");
    setLoginUser("");
    setLoginPass("");
  };

  // Applicant Actions
  const handleStatusChange = (id: string, newStatus: "pending" | "approved" | "rejected") => {
    const updated = updateApplicantStatus(id, newStatus);
    setApplicants(updated);
    showToast(`Applicant status updated to ${newStatus.toUpperCase()}`);
  };

  const handleDeleteApplicant = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete registration for "${name}"?`)) {
      const updated = deleteApplicant(id);
      setApplicants(updated);
      showToast(`Registration for "${name}" deleted`);
    }
  };

  // Password Generator Handler
  const handleGeneratePassword = () => {
    const p = generateRandomPassword(genLength);
    setGeneratedPass(p);
  };

  const copyToClipboard = (text: string, label: string = "Password") => {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast(`${label} copied to clipboard!`);
  };

  // Add Saved Credential
  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newUsername || !newPassword) return;
    addSavedPassword({
      serviceName: newServiceName,
      username: newUsername,
      password: newPassword,
      category: newCategory,
    }, loginPass).then((updatedData) => {
      setPasswords(updatedData);
      setNewServiceName("");
      setNewUsername("");
      setNewPassword("");
      setShowAddPassModal(false);
      showToast(`Saved credentials for "${newServiceName}"`);
    });
  };

  // Delete Saved Credential
  const handleDeleteCredential = (id: string, name: string) => {
    if (window.confirm(`Delete password for "${name}"?`)) {
      deleteSavedPassword(id, loginPass).then(updated => {
        setPasswords(updated);
        showToast(`Credential for "${name}" removed`);
      });
    }
  };

  // Handle Change Admin Password
  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPass.length < 6) {
      setPassChangeMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      setPassChangeMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    const result = await updateAdminPassword(currentPass, newAdminPass);
    if (result === "bad-current") {
      setPassChangeMsg({ type: "error", text: "Current password is incorrect." });
      return;
    }

    setLoginPass(newAdminPass);
    setCurrentPass("");
    setNewAdminPass("");
    setConfirmAdminPass("");
    setPassChangeMsg({ type: "success", text: "Admin password successfully updated!" });
    showToast("Admin password changed successfully");
  };

  // Filtered applicants safely
  const safeApplicants = Array.isArray(applicants) ? applicants : [];
  const filteredApplicants = safeApplicants.filter((a) => {
    if (!a) return false;
    const searchLower = (applicantSearch || "").toLowerCase();
    const nameStr = (a.name || "").toLowerCase();
    const phoneStr = (a.phone || "").toLowerCase();
    const emailStr = (a.email || "").toLowerCase();
    const courseStr = (a.course || "").toLowerCase();

    const matchesSearch =
      nameStr.includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      emailStr.includes(searchLower) ||
      courseStr.includes(searchLower);
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Applicant stats
  const totalCount = safeApplicants.length;
  const pendingCount = safeApplicants.filter((a) => a && a.status === "pending").length;
  const approvedCount = safeApplicants.filter((a) => a && a.status === "approved").length;
  const rejectedCount = safeApplicants.filter((a) => a && a.status === "rejected").length;

  // -------------------------------------------------------------
  // LOGIN / SETUP SCREEN
  // -------------------------------------------------------------
  if (authStatus !== "authenticated") {
    if (authStatus === "loading") {
      return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
    }

    const isSetup = authStatus === "setup";

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Back button */}
          {onBackToSite && (
            <button
              onClick={onBackToSite}
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Main Website
            </button>
          )}

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/40 mb-4">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">{isSetup ? "First Time Setup" : "Aleph Admin Portal"}</h1>
              <p className="mt-1 text-xs text-slate-400">{isSetup ? "Create the master administrator account" : "Sign in to manage applicants and site settings"}</p>
            </div>

            {loginError && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/50 p-3 text-xs font-semibold text-red-300 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                {loginError}
              </div>
            )}

            <form onSubmit={isSetup ? handleSetup : handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Username / Email</label>
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="admin@alephgraphics.et"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition-all hover:scale-[1.01]"
              >
                {isSetup ? "Create Admin Account" : "Sign In to Admin Panel"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 animate-bounce rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-brand-600/50 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {toastMsg}
        </div>
      )}

      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo dark size="sm" />
            <div className="hidden sm:block h-6 w-px bg-white/10" />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-300 border border-brand-500/30">
              <Shield className="h-3.5 w-3.5 text-brand-400" /> Admin Control Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onBackToSite && (
              <button
                onClick={onBackToSite}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> View Site
              </button>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600/20 border border-red-500/30 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-600/30 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("applicants")}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === "applicants"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" /> Applicants & Registrations
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-slate-950 font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("passwords")}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === "passwords"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Key className="h-4 w-4" /> Password Manager & Vault
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === "settings"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Lock className="h-4 w-4" /> Security & Passwords
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
              activeTab === "courses"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BookOpen className="h-4 w-4" /> Manage Courses
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: APPLICANTS & REGISTRATIONS */}
        {/* ========================================================= */}
        {activeTab === "applicants" && (
          <div className="space-y-6">
            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applicants</span>
                  <Users className="h-5 w-5 text-brand-400" />
                </div>
                <p className="mt-3 text-3xl font-black text-white">{totalCount}</p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Pending Review</span>
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <p className="mt-3 text-3xl font-black text-amber-300">{pendingCount}</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Approved</span>
                  <UserCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="mt-3 text-3xl font-black text-emerald-300">{approvedCount}</p>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-300">Rejected</span>
                  <UserX className="h-5 w-5 text-red-400" />
                </div>
                <p className="mt-3 text-3xl font-black text-red-300">{rejectedCount}</p>
              </div>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-slate-900 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applicants by name, phone, course..."
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-400 font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="all">All Registrations</option>
                  <option value="pending">Pending Only</option>
                  <option value="approved">Approved Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
              </div>
            </div>

            {/* APPLICANTS TABLE */}
            <div className="rounded-3xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/10 bg-slate-950 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-bold">Applicant Details</th>
                      <th className="px-6 py-4 font-bold">Course & Schedule</th>
                      <th className="px-6 py-4 font-bold">Registered Date</th>
                      <th className="px-6 py-4 font-bold">Approval Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          No registration records found.
                        </td>
                      </tr>
                    ) : (
                      filteredApplicants.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{app.name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{app.phone}</p>
                            {app.email && <p className="text-xs text-brand-300 mt-0.5">{app.email}</p>}
                            {app.message && (
                              <p className="mt-1 text-xs italic text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-white/5">
                                "{app.message}"
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-semibold text-white block">{app.course}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">{app.schedule}</span>
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                            {app.createdAt ? (() => {
                              try {
                                const d = new Date(app.createdAt);
                                return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              } catch (_) {
                                return "N/A";
                              }
                            })() : "N/A"}
                          </td>

                          <td className="px-6 py-4">
                            {app.status === "approved" && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Approved
                              </span>
                            )}
                            {app.status === "pending" && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                                <Clock className="h-3.5 w-3.5 text-amber-400" /> Pending Approval
                              </span>
                            )}
                            {app.status === "rejected" && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300 border border-red-500/30">
                                <XCircle className="h-3.5 w-3.5 text-red-400" /> Rejected
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedApplicant(app)}
                                title="View All Applicant Details"
                                className="rounded-lg bg-brand-600/30 border border-brand-500/40 p-2 text-brand-300 hover:bg-brand-600 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">Details</span>
                              </button>

                              {app.status !== "approved" && (
                                <button
                                  onClick={() => handleStatusChange(app.id, "approved")}
                                  title="Approve Applicant"
                                  className="rounded-lg bg-emerald-600/30 border border-emerald-500/40 p-2 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}

                              {app.status !== "rejected" && (
                                <button
                                  onClick={() => handleStatusChange(app.id, "rejected")}
                                  title="Reject Applicant"
                                  className="rounded-lg bg-amber-600/30 border border-amber-500/40 p-2 text-amber-300 hover:bg-amber-600 hover:text-white transition-all"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteApplicant(app.id, app.name)}
                                title="Delete Record"
                                className="rounded-lg bg-red-600/20 border border-red-500/30 p-2 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* APPLICANT FULL DETAILS MODAL */}
            {selectedApplicant && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {selectedApplicant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedApplicant.name}</h3>
                        <p className="text-xs text-slate-400">Applicant Information Summary</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedApplicant(null)}
                      className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="rounded-2xl border border-white/5 bg-slate-950 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Full Name:</span>
                        <span className="font-bold text-white">{selectedApplicant.name}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <span className="text-xs font-semibold text-slate-400">Phone Number:</span>
                        <a href={`tel:${selectedApplicant.phone}`} className="font-mono font-bold text-brand-300 hover:underline">
                          {selectedApplicant.phone}
                        </a>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <span className="text-xs font-semibold text-slate-400">Email Address:</span>
                        {selectedApplicant.email ? (
                          <a href={`mailto:${selectedApplicant.email}`} className="font-mono text-xs text-sky-400 hover:underline">
                            {selectedApplicant.email}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">Not provided</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <span className="text-xs font-semibold text-slate-400">Course Selected:</span>
                        <span className="font-bold text-emerald-400">{selectedApplicant.course}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <span className="text-xs font-semibold text-slate-400">Schedule Preference:</span>
                        <span className="text-xs font-semibold text-slate-200">{selectedApplicant.schedule}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <span className="text-xs font-semibold text-slate-400">Registration Date:</span>
                        <span className="text-xs font-mono text-slate-300">
                          {selectedApplicant.createdAt ? new Date(selectedApplicant.createdAt).toLocaleString() : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <span className="text-xs font-semibold text-slate-400">Approval Status:</span>
                        <span className="uppercase text-xs font-black tracking-wider text-brand-400">{selectedApplicant.status}</span>
                      </div>
                    </div>

                    {selectedApplicant.message && (
                      <div className="rounded-2xl border border-white/5 bg-slate-950 p-4">
                        <span className="text-xs font-semibold text-slate-400 block mb-1">Applicant Message / Notes:</span>
                        <p className="text-xs italic text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5">
                          "{selectedApplicant.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex gap-2">
                      {selectedApplicant.status !== "approved" && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedApplicant.id, "approved");
                            setSelectedApplicant((prev) => prev ? { ...prev, status: "approved" } : null);
                          }}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                        >
                          Approve Applicant
                        </button>
                      )}
                      {selectedApplicant.status !== "rejected" && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedApplicant.id, "rejected");
                            setSelectedApplicant((prev) => prev ? { ...prev, status: "rejected" } : null);
                          }}
                          className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 shadow-lg shadow-amber-600/30"
                        >
                          Reject Applicant
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedApplicant(null)}
                      className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PASSWORD MANAGER & VAULT */}
        {/* ========================================================= */}
        {activeTab === "passwords" && (
          <div className="space-y-6">
            {/* RANDOM PASSWORD GENERATOR BOX */}
            <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-950/60 via-slate-900 to-sky-950/60 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Random Password Generator</h2>
                    <p className="text-xs text-slate-400">Generate secure encrypted passwords for staff or students</p>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 transition-all shadow-lg"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Generate New
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    readOnly
                    value={generatedPass}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-base font-bold text-emerald-400 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedPass, "Generated Password")}
                    className="absolute right-2 top-2 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-500 transition-all flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Length:</span>
                  {[12, 16, 24].map((len) => (
                    <button
                      key={len}
                      onClick={() => {
                        setGenLength(len);
                        setGeneratedPass(generateRandomPassword(len));
                      }}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                        genLength === len
                          ? "border-brand-500 bg-brand-600 text-white"
                          : "border-white/10 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      {len} chars
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SAVED PASSWORDS VAULT HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-400" /> Admin Credentials Vault
                </h3>
                <p className="text-xs text-slate-400">Store and manage official account login details securely</p>
              </div>

              <button
                onClick={() => setShowAddPassModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-all shadow-lg"
              >
                <Plus className="h-4 w-4" /> Add Credential
              </button>
            </div>

            {/* PASSWORDS VAULT GRID */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {passwords.map((p) => {
                const isVisible = visiblePassIds[p.id] || false;
                return (
                  <div key={p.id} className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-300 border border-white/5">
                          {p.category}
                        </span>
                        <h4 className="mt-2 text-base font-bold text-white">{p.serviceName}</h4>
                      </div>

                      <button
                        onClick={() => handleDeleteCredential(p.id, p.serviceName)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>Username:</span>
                        <span className="font-mono text-white font-bold">{p.username}</span>
                      </div>

                      <div className="text-slate-400 flex items-center justify-between">
                        <span>Password:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">
                            {isVisible ? p.password : "••••••••••••"}
                          </span>
                          <button
                            onClick={() =>
                              setVisiblePassIds((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                            }
                            className="text-slate-400 hover:text-white"
                            title={isVisible ? "Hide Password" : "Show Password"}
                          >
                            {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(p.password, `${p.serviceName} Password`)}
                      className="w-full mt-2 rounded-xl border border-white/10 bg-slate-950 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy Password
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ADD CREDENTIAL MODAL */}
            {showAddPassModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Plus className="h-4 w-4 text-brand-400" /> Add New Saved Credential
                    </h3>
                    <button
                      onClick={() => setShowAddPassModal(false)}
                      className="text-slate-400 hover:text-white font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddCredential} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold uppercase text-slate-300 mb-1">Service / Account Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Academy Instagram Account"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-300 mb-1">Username / Email</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. admin@alephgraphics.et"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-300 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 pr-20 text-sm text-white font-mono focus:border-brand-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setNewPassword(generateRandomPassword(16))}
                          className="absolute right-2 top-2 rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-bold text-brand-300 hover:bg-slate-700"
                        >
                          Auto Gen
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold uppercase text-slate-300 mb-1">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
                      >
                        <option value="Social Media">Social Media</option>
                        <option value="Email / Server">Email / Server</option>
                        <option value="Tools & Software">Tools & Software</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPassModal(false)}
                        className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 font-bold text-slate-300 hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-brand-600 px-5 py-2 font-bold text-white hover:bg-brand-500"
                      >
                        Save Credential
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SECURITY & ADMIN PASSWORD CHANGE */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Change Admin Password</h2>
                  <p className="text-xs text-slate-400">Update your main login password for the Admin Panel</p>
                </div>
              </div>

              {passChangeMsg && (
                <div
                  className={`mb-6 rounded-xl border p-4 text-xs font-semibold flex items-center gap-2 ${
                    passChangeMsg.type === "success"
                      ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                      : "border-red-500/30 bg-red-950/40 text-red-300"
                  }`}
                >
                  {passChangeMsg.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-red-400" />
                  )}
                  {passChangeMsg.text}
                </div>
              )}

              <form onSubmit={handleChangeAdminPassword} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Current Admin Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">New Admin Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition-all"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: COURSES */}
        {/* ========================================================= */}
        {activeTab === "courses" && (
          <AdminCourses />
        )}
      </main>
    </div>
  );
}
