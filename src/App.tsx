/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { IntroductionPage } from "./pages/Introduction";
import { PopulationMaintenancePage } from "./pages/PopulationMaintenance";
import { DistrictMaintenancePage } from "./pages/DistrictMaintenance";
import { ProfilingPage } from "./pages/Profiling";
import { ExamDataPage } from "./pages/ExamData";
import { CohortExportPage } from "./pages/CohortExport";
import { FollowUpQueryPage } from "./pages/FollowUpQuery";
import { LossToFollowUpPage } from "./pages/LossToFollowUp";
import { DeathArchivingPage } from "./pages/DeathArchiving";
import { HealthAnalysisPage } from "./pages/HealthAnalysis";
import { HealthStatsTablePage } from "./pages/HealthStatsTable";
import { StatsPresenterPage } from "./pages/StatsPresenter";
import { HealthQueryPage } from "./pages/HealthQuery";
import { SpecimensPage } from "./pages/Specimens";
import { RolesPage } from "./pages/Roles";
import { UsersPage } from "./pages/Users";

export default function App() {
  const [activePage, setActivePage] = React.useState<string>("introduction");

  const renderPage = () => {
    switch (activePage) {
      // Basic info
      case "introduction":
        return <IntroductionPage />;
      case "population-maintenance":
        return <PopulationMaintenancePage />;
      case "district-maintenance":
        return <DistrictMaintenancePage />;

      // Data IO
      case "profiling":
        return <ProfilingPage />;
      case "exam-data":
        return <ExamDataPage />;
      case "cohort-export":
      case "export-request":
        return <CohortExportPage mode="request" />;
      case "export-approve":
        return <CohortExportPage mode="approve" />;

      // Follow-up
      case "follow-up-query":
        return <FollowUpQueryPage />;
      case "lost-follow-up":
        return <LossToFollowUpPage />;
      case "death-archiving":
        return <DeathArchivingPage />;

      // Stats & analysis
      case "health-indicator-trends":
        return <HealthAnalysisPage />;
      case "health-stats-table":
        return <HealthStatsTablePage />;
      case "health-stats-export":
        return <StatsPresenterPage />;
      case "health-query":
      case "basic-info-query":
        return <HealthQueryPage />;

      // Specimen shell
      case "specimens":
        return <SpecimensPage />;

      // Permissions
      case "roles":
        return <RolesPage />;
      case "users":
        return <UsersPage />;

      default:
        return <IntroductionPage />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      <Sidebar activeId={activePage} onNavigate={setActivePage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
