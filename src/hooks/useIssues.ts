import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { INITIAL_MOCK_ISSUES } from '../data/mockIssues';
import { Issue, IssueStatus, SimulatedRouteStatus, DashboardMetrics, CivicMode, IssueCategory, IssueSeverity, FilterOptions } from '../types';

const ISSUES_STORAGE_KEY = 'guddhamutk_issues_data_v1';
const CONFIRMED_ISSUES_KEY = 'guddhamutk_user_confirmed_ids';

export function useIssues() {
  const [issues, setIssues] = useLocalStorage<Issue[]>(ISSUES_STORAGE_KEY, INITIAL_MOCK_ISSUES);
  const [userConfirmedIds, setUserConfirmedIds] = useLocalStorage<string[]>(CONFIRMED_ISSUES_KEY, []);

  // Helper to add a new issue
  const addIssue = useCallback(
    (newIssueData: Omit<Issue, 'confirmationCount' | 'timeline' | 'updatedAt' | 'createdAt' | 'isOverdue' | 'isEscalated' | 'slaDeadline' | 'simulatedRouteStatus'>) => {
      const now = new Date();
      const slaHours = newIssueData.severity === 'Immediate Danger' ? 24 : newIssueData.severity === 'High' ? 72 : 120;
      const slaDeadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000).toISOString();

      const newIssue: Issue = {
        ...newIssueData,
        confirmationCount: 1,
        status: 'Reported',
        simulatedRouteStatus: 'Prepared',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        slaDeadline,
        isOverdue: false,
        isEscalated: false,
        timeline: [
          {
            id: `tl-${Date.now()}-1`,
            stage: 'Reported',
            title: 'Report Submitted',
            description: `Issue registered by citizen with verified GPS coordinates.`,
            timestamp: now.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            actor: newIssueData.reporterName || 'Citizen (Mobile Report)',
            isCompleted: true,
            isCurrent: true,
          },
        ],
      };

      setIssues((prev) => [newIssue, ...prev]);
      setUserConfirmedIds((prev) => (prev.includes(newIssue.id) ? prev : [...prev, newIssue.id]));
      return newIssue;
    },
    [setIssues, setUserConfirmedIds]
  );

  // Helper to confirm an existing issue ("Still unresolved" button)
  const confirmIssue = useCallback(
    (issueId: string): boolean => {
      let alreadyConfirmed = userConfirmedIds.includes(issueId);

      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id === issueId) {
            return {
              ...issue,
              confirmationCount: issue.confirmationCount + (alreadyConfirmed ? 1 : 1),
              updatedAt: new Date().toISOString(),
            };
          }
          return issue;
        })
      );

      if (!alreadyConfirmed) {
        setUserConfirmedIds((prev) => [...prev, issueId]);
      }

      return true;
    },
    [userConfirmedIds, setIssues, setUserConfirmedIds]
  );

  // Helper to update issue status (Admin Demo operations)
  const updateIssueStatus = useCallback(
    (
      issueId: string,
      newStatus: IssueStatus,
      note?: string,
      repairProofUrl?: string,
      forceEscalate?: boolean
    ) => {
      const now = new Date();
      const timeStr = now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id !== issueId) return issue;

          let simulatedRoute: SimulatedRouteStatus = issue.simulatedRouteStatus;
          if (newStatus === 'Acknowledged') simulatedRoute = 'Acknowledged';
          if (newStatus === 'Inspection Scheduled' || newStatus === 'Repair In Progress') simulatedRoute = 'Acknowledged';
          if (newStatus === 'Resolved' || newStatus === 'Citizen Verified') simulatedRoute = 'Acknowledged';
          if (forceEscalate) simulatedRoute = 'Escalation packet ready';

          // Update timeline
          const existingTimeline = [...issue.timeline];
          
          // Mark previous as completed
          existingTimeline.forEach((t) => {
            t.isCurrent = false;
          });

          // Add or update timeline node
          const stageIndex = existingTimeline.findIndex((t) => t.stage === newStatus);
          if (stageIndex >= 0) {
            existingTimeline[stageIndex].isCompleted = true;
            existingTimeline[stageIndex].isCurrent = true;
            existingTimeline[stageIndex].timestamp = timeStr;
            if (note) existingTimeline[stageIndex].description = note;
          } else {
            existingTimeline.push({
              id: `tl-${Date.now()}`,
              stage: newStatus,
              title: newStatus,
              description: note || `Status updated to ${newStatus} by authority operations.`,
              timestamp: timeStr,
              actor: 'Authorized Municipal Operator (Demo Admin)',
              isCompleted: true,
              isCurrent: true,
            });
          }

          if (forceEscalate) {
            existingTimeline.push({
              id: `tl-esc-${Date.now()}`,
              stage: 'Overdue Escalation',
              title: 'Manual Administrative Escalation Triggered',
              description: note || 'Escalation packet dispatched to senior zonal executive & public representatives.',
              timestamp: timeStr,
              actor: 'Admin Operations',
              isCompleted: true,
              isCurrent: true,
            });
          }

          const adminNotes = issue.adminNotes ? [...issue.adminNotes] : [];
          if (note) adminNotes.push(`[${timeStr}] ${note}`);

          return {
            ...issue,
            status: newStatus,
            simulatedRouteStatus: forceEscalate ? 'Escalation packet ready' : simulatedRoute,
            repairProofUrl: repairProofUrl || issue.repairProofUrl,
            isEscalated: forceEscalate ? true : issue.isEscalated,
            updatedAt: now.toISOString(),
            timeline: existingTimeline,
            adminNotes,
          };
        })
      );
    },
    [setIssues]
  );

  // Helper to rate resolution
  const rateIssueResolution = useCallback(
    (issueId: string, score: number, feedback?: string) => {
      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id === issueId) {
            return {
              ...issue,
              userRating: {
                score,
                feedback,
                ratedAt: new Date().toISOString(),
              },
              status: score >= 4 ? 'Citizen Verified' : issue.status,
            };
          }
          return issue;
        })
      );
    },
    [setIssues]
  );

  // Reset demo data to factory defaults
  const resetToFactoryDemoData = useCallback(() => {
    setIssues(INITIAL_MOCK_ISSUES);
    setUserConfirmedIds([]);
  }, [setIssues, setUserConfirmedIds]);

  // Filter issues
  const filterIssues = useCallback(
    (options: FilterOptions) => {
      return issues.filter((issue) => {
        if (options.mode && options.mode !== 'all' && issue.mode !== options.mode) {
          return false;
        }
        if (options.category && options.category !== 'All' && issue.category !== options.category) {
          return false;
        }
        if (options.status && options.status !== 'All' && issue.status !== options.status) {
          return false;
        }
        if (options.severity && options.severity !== 'All' && issue.severity !== options.severity) {
          return false;
        }
        if (options.wardOrVillage && issue.wardOrVillage !== options.wardOrVillage) {
          return false;
        }
        if (options.isOverdue && !issue.isOverdue) {
          return false;
        }
        if (options.searchQuery && options.searchQuery.trim()) {
          const query = options.searchQuery.toLowerCase();
          const matchTitle = issue.title.toLowerCase().includes(query);
          const matchAddress = issue.address.toLowerCase().includes(query);
          const matchId = issue.id.toLowerCase().includes(query);
          const matchWard = issue.wardOrVillage.toLowerCase().includes(query);
          const matchCategory = issue.category.toLowerCase().includes(query);
          if (!matchTitle && !matchAddress && !matchId && !matchWard && !matchCategory) {
            return false;
          }
        }
        return true;
      });
    },
    [issues]
  );

  // Compute metrics dynamically based on current state & optional mode
  const getMetrics = useCallback(
    (mode?: CivicMode | 'all'): DashboardMetrics => {
      const targetIssues = mode && mode !== 'all' ? issues.filter((i) => i.mode === mode) : issues;

      const totalReports = targetIssues.length;
      const verifiedCount = targetIssues.reduce((sum, i) => sum + i.confirmationCount, 0);
      const resolvedCount = targetIssues.filter((i) => i.status === 'Resolved' || i.status === 'Citizen Verified').length;
      const overdueCount = targetIssues.filter((i) => i.isOverdue || i.simulatedRouteStatus === 'Overdue').length;
      const inProgressCount = targetIssues.filter(
        (i) => i.status === 'Acknowledged' || i.status === 'Inspection Scheduled' || i.status === 'Repair In Progress'
      ).length;
      const escalatedCount = targetIssues.filter((i) => i.isEscalated || i.simulatedRouteStatus === 'Escalation packet ready').length;

      const avgAckTimeDays = mode === 'rural' ? 1.8 : 1.2;
      const avgRepairTimeDays = mode === 'rural' ? 4.5 : 3.2;

      return {
        totalReports,
        verifiedCount,
        resolvedCount,
        overdueCount,
        inProgressCount,
        escalatedCount,
        avgAckTimeDays,
        avgRepairTimeDays,
        averageAcknowledgementHours: Math.round(avgAckTimeDays * 24),
        averageResolutionDays: avgRepairTimeDays,
      };
    },
    [issues]
  );

  const getIssueById = useCallback(
    (id: string) => {
      return issues.find((issue) => issue.id.toLowerCase() === id.toLowerCase());
    },
    [issues]
  );

  return {
    issues,
    userConfirmedIds,
    addIssue,
    confirmIssue,
    updateIssueStatus,
    rateIssueResolution,
    resetToFactoryDemoData,
    filterIssues,
    getMetrics,
    getIssueById,
  };
}
