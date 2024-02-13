import { createSlice } from '@reduxjs/toolkit';
// utils
import API from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  onCreateProjectSuccess: false,
  creatingProjectStakeholder: null,
  createStakeholderSuccess: null,
  createStakeholderError: null,
  businessPlanFieldUpdated: null,
  work: {
    id: null,
    project_name: null,
    type_project: null,
    activity_sector: null,
    business_plan: null,
    project_legal_status: null,
    revenues: [],
    revenue_sources: [],
    expenses: [],
    directors: [],
    employees: [],
    investments: [],
    capitalContributions: [],
    associatesCapitalContributions: [],
    loans: [],
    testSuites: null,
    selectedTestSuiteLabel: null,
    aggregateFinancialProvisions: null,
    seatedParticipants: null
  }
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    onCreateStakeholderSuccess(state, action) {
      state.creatingProjectStakeholder = false;
      state.createStakeholderSuccess = true;
      state.createStakeholderError = null;
      state.error = null;
      state.work.business_plan.project_stakeholders = [
        action.payload,
        ...(state.work.business_plan?.project_stakeholders ? state.work.business_plan?.project_stakeholders : [])
      ];
    },
    onCreateStakeholderError(state, action) {
      state.creatingProjectStakeholder = false;
      state.createStakeholderError = true;
      state.createStakeholderSuccess = null;
      state.error = action.payload;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    onUpdateBusinessPlanField(state) {
      state.error = null;
      state.businessPlanFieldUpdated = true;
    },
    onFailedUpdateBusinessPlanField(state, action) {
      state.error = action.payload;
      state.businessPlanFieldUpdated = false;
    },
    onGetProjectLegalStatusSuccess(state, action) {
      state.error = null;
      state.isLoading = false;
      state.work.project_legal_status = action.payload;
    },
    updateLegalStatusSuccess(state, action) {
      state.error = null;
      state.work.project_legal_status = action.payload;
    },

    updateProjectRecommendedLegalStatusSuccess(state, action) {
      state.error = null;
      state.work.project_legal_status = action.payload;
    },

    createRevenue(state, action) {
      state.error = null;
      state.work.revenues = [action.payload, ...state.work.revenues];
    },

    createRevenueSource(state, action) {
      state.error = null;
      state.work.revenue_sources = [...state.work.revenue_sources, action.payload];
    },

    updateRevenue(state, action) {
      state.error = null;
      state.work.revenues = action.payload;
    },

    fetchedRevenues(state, action) {
      state.error = null;
      state.work.revenues = action.payload.revenues || [];
      state.work.revenue_sources = action.payload.revenue_sources || [];
    },

    deleteRevenue(state, action) {
      state.error = null;
      state.work.revenues = action.payload || [];
    },

    onDeleteProjectStakeholder(state, action) {
      state.error = null;
      state.isLoading = false;
      state.work.business_plan.project_stakeholders = action.payload || [];
    },

    deleteRevenueSource(state, action) {
      state.error = null;
      state.work.revenue_sources = action.payload || [];
    },

    updateRevenueSource(state, action) {
      state.error = null;
      state.work.revenue_sources = state.work.revenue_sources.map((revenueSource) =>
        revenueSource.id === action.payload.id ? action.payload : revenueSource
      );
    },

    fetchedExpenses(state, action) {
      state.error = null;
      state.work.expenses = action.payload || [];
    },

    expenseDelete(state, action) {
      state.error = null;
      state.work.expenses = action.payload || [];
    },

    createExpense(state, action) {
      state.error = null;
      state.work.expenses = [action.payload, ...state.work.expenses];
    },

    updateExpense(state, action) {
      state.error = null;
      state.work.expenses = action.payload;
    },

    fetchEmployees(state, action) {
      state.error = null;
      state.work.directors = action.payload.directors || [];
      state.work.employees = action.payload.employees || [];
    },

    deleteEmployee(state, action) {
      state.error = null;
      state.work.employees = action.payload || [];
    },

    createEmployee(state, action) {
      state.error = null;
      state.work.employees = [action.payload, ...state.work.employees];
    },

    updateEmployee(state, action) {
      state.error = null;
      state.work.employees = state.work.employees.map((employee) =>
        employee.id === action.payload.id ? action.payload : employee
      );
    },

    deleteDirector(state, action) {
      state.error = null;
      state.work.directors = action.payload || [];
    },

    createDirector(state, action) {
      state.error = null;
      state.work.directors = [action.payload, ...state.work.directors];
    },

    updateDirector(state, action) {
      state.error = null;
      state.work.directors = action.payload || [];
    },

    fetchedInvestments(state, action) {
      state.error = null;
      state.work.investments = action.payload || [];
    },

    deleteInvestment(state, action) {
      state.error = null;
      state.work.investments = action.payload || [];
    },

    createInvestment(state, action) {
      state.error = null;
      state.work.investments = [action.payload, ...state.work.investments];
    },

    updateInvestment(state, action) {
      state.error = null;
      state.work.investments = action.payload;
    },

    fetchedCapitalContribution(state, action) {
      state.error = null;
      state.work.capitalContributions = action.payload || [];
    },

    deleteCapitalContribution(state, action) {
      state.error = null;
      state.work.capitalContributions = action.payload || [];
    },

    createCapitalContribution(state, action) {
      state.error = null;
      state.work.capitalContributions = [action.payload, ...state.work.capitalContributions];
    },

    updateCapitalContribution(state, action) {
      state.error = null;
      state.work.capitalContributions = state.work.capitalContributions.map((capitalContribution) =>
        capitalContribution.id === action.payload.id ? action.payload : capitalContribution
      );
    },

    fetchedAssociateCapitalContributions(state, action) {
      state.error = null;
      state.work.associatesCapitalContributions = action.payload || [];
    },

    deleteAssociateCapitalContribution(state, action) {
      state.error = null;
      state.work.associatesCapitalContributions = action.payload || [];
    },

    createAssociateCapitalContribution(state, action) {
      state.error = null;
      state.work.associatesCapitalContributions = [action.payload, ...state.work.associatesCapitalContributions];
    },

    updateAssociateCapitalContribution(state, action) {
      state.error = null;
      state.work.associatesCapitalContributions = state.work.associatesCapitalContributions.map(
        (associatesCapitalContribution) =>
          associatesCapitalContribution.id === action.payload.id ? action.payload : associatesCapitalContribution
      );
    },

    fetchedLoans(state, action) {
      state.error = null;
      state.work.loans = action.payload || [];
    },

    deleteLoan(state, action) {
      state.error = null;
      state.work.loans = action.payload || [];
    },

    createLoan(state, action) {
      state.error = null;
      state.work.loans = [action.payload, ...state.work.loans];
    },

    updateLoan(state, action) {
      state.error = null;
      state.work.loans = state.work.loans.map((loan) => (loan.id === action.payload.id ? action.payload : loan));
    },

    fetchedFinances(state, action) {
      state.error = null;
      state.work.loans = action.payload.loans || [];
      state.work.associatesCapitalContributions = action.payload.associates_capital_contributions || [];
      state.work.capitalContributions = action.payload.capital_Contributions || [];
    },
    fetchAggregateFinancialProvisions(state, action) {
      state.error = null;
      state.work.aggregateFinancialProvisions = action.payload;
    },
    getProjectBusinessPlanSuccess(state, action) {
      state.error = null;
      state.isLoading = false;
      state.work.business_plan = action.payload;
    },
    onFetchProjectStakeholdersSuccess(state, action) {
      state.error = null;
      state.isLoading = false;
      state.work.business_plan.project_stakeholders = action.payload;
    },
    updateProjectStakeholdersSuccess(state, action) {
      state.error = null;
      state.work.business_plan.project_stakeholders = state.work.business_plan.project_stakeholders.map((stakeholder) =>
        stakeholder.id === action.payload.id ? action.payload : stakeholder
      );
    },
    createProjectSuccess(state, action) {
      state.error = null;
      state.onCreateProjectSuccess = true;
      state.work.id = action.payload.id;
      state.work.project_name = action.payload.project_name;
      state.work.type_project = action.payload.type_project;
      state.work.activity_sector = action.payload.activity_sector;
    },
    onTestSuiteSuccess(state, action) {
      state.error = null;

      state.work.testSuites = action.payload;
    },
    onProjectSelected(state, action) {
      localStorage.setItem('selected_project', JSON.stringify(action.payload));
      state.work.id = action.payload.id;
      state.work.project_name = action.payload.project_name;
      state.work.type_project = action.payload.type_project;
      state.work.activity_sector = action.payload.activity_sector;
    },
    isProjectSelected(state) {
      const storedSelectedProject = localStorage.getItem('selected_project');
      const selectedProject = storedSelectedProject !== null ? JSON.parse(storedSelectedProject) : null;
      if (selectedProject) {
        state.work.id = selectedProject.id;
        state.work.project_name = selectedProject.project_name;
        state.work.type_project = selectedProject.type_project;
        state.work.activity_sector = selectedProject.activity_sector;
      }
    },
    selectTestSuiteLabel(state, action) {
      localStorage.setItem('selected_project_test_suite', JSON.stringify(action.payload));
    },
    isSelectedProjectTestSuiteLabel(state) {
      const storedSelectedProjectTestSuiteLabel = localStorage.getItem('selected_project_test_suite');
      const selectedProjectTestSuiteLabel =
        storedSelectedProjectTestSuiteLabel !== null ? JSON.parse(storedSelectedProjectTestSuiteLabel) : null;
      if (selectedProjectTestSuiteLabel) {
        state.work.selectedTestSuiteLabel = selectedProjectTestSuiteLabel;
      }
    },
    createProjectStakeholderProgress(state) {
      state.creatingProjectStakeholder = true;
    },
    setSeatedBoardRoomParticipants(state, action) {
      state.work.seatedParticipants = state.work.seatedParticipants
        ? action.payload.reduce((acc, seat) => {
            const newSeat = action.payload.find((s_) => s_.id === seat.id);
            if (newSeat && typeof newSeat !== 'undefined') {
              acc.push(newSeat);
              return acc;
            }
            acc.push(seat);
            return acc;
          }, [])
        : action.payload;
    }
  }
});

// Reducer
export default slice.reducer;
export const {
  onProjectSelected,
  isProjectSelected,
  selectTestSuiteLabel,
  isSelectedProjectTestSuiteLabel,
  createProjectStakeholderProgress,
  setSeatedBoardRoomParticipants
} = slice.actions;
// ----------------------------------------------------------------------

export function createProject(data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/user/projects/new`, data);
      dispatch(slice.actions.createProjectSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProjectBusinessPlan(id, apiPrefix) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/business_plan`);
      dispatch(slice.actions.getProjectBusinessPlanSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------
export function getProjectLegalStatus(id, apiPrefix) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/project_legal_status`);
      dispatch(slice.actions.onGetProjectLegalStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------

export function updateProjectLegalStatus(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/project_legal_status`, data);
      dispatch(slice.actions.updateLegalStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------

export function updateProjectRecommendedLegalStatus(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/project_legal_status/criteria-based`, data);
      dispatch(slice.actions.updateProjectRecommendedLegalStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// ----------------------------------------------------------------------

export function updateProjectTaxesConfigurations(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(
        `v1/workstation/projects/${id}/project_taxes_configurations/criteria-based`,
        data
      );
      dispatch(slice.actions.updateLegalStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateProjectTvaConfigurations(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/project_tva_configurations/criteria-based`, data);
      dispatch(slice.actions.updateLegalStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createRevenue(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/revenues`, data);
      dispatch(slice.actions.createRevenue(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchRevenues(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/revenue-details`);

      dispatch(slice.actions.fetchedRevenues(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createRevenueSource(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/revenue-source`, data);
      dispatch(slice.actions.createRevenueSource(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteRevenue(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/revenues`, { data });
      dispatch(slice.actions.deleteRevenue(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteRevenueSource(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/revenue-source`, { data });
      dispatch(slice.actions.deleteRevenueSource(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateRevenue(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/revenues`, data);
      dispatch(slice.actions.updateRevenue(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateRevenueSource(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/revenue-source`, data);
      dispatch(slice.actions.updateRevenueSource(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchExpenses(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/expenses`);
      dispatch(slice.actions.fetchedExpenses(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteExpense(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/expenses`, { data });
      dispatch(slice.actions.expenseDelete(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createExpense(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/expenses`, data);
      dispatch(slice.actions.createExpense(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateExpense(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/expenses`, data);
      dispatch(slice.actions.updateExpense(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchEmployees(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/employee-details`);
      dispatch(slice.actions.fetchEmployees(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEmployee(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/employee`, {
        data
      });
      dispatch(slice.actions.deleteEmployee(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEmployee(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/employee`, data);
      dispatch(slice.actions.createEmployee(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEmployee(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/employee`, data);
      dispatch(slice.actions.updateEmployee(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteDirector(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/director`, {
        data
      });
      dispatch(slice.actions.deleteDirector(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createDirector(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/director`, data);
      dispatch(slice.actions.createDirector(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateDirector(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/director`, data);
      dispatch(slice.actions.updateDirector(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchInvestments(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/investments`);
      dispatch(slice.actions.fetchedInvestments(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteInvestment(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/investments`, { data });
      dispatch(slice.actions.deleteInvestment(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createInvestment(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/investments`, data);
      dispatch(slice.actions.createInvestment(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateInvestment(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/investments`, data);
      dispatch(slice.actions.updateInvestment(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchCapitalContributions(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/capital_contributions`);
      dispatch(slice.actions.fetchedCapitalContribution(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteCapitalContribution(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/capital_contributions`, { data });
      dispatch(slice.actions.deleteCapitalContribution(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createCapitalContribution(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/capital_contributions`, data);
      dispatch(slice.actions.createCapitalContribution(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateCapitalContribution(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/capital_contributions`, data);
      dispatch(slice.actions.updateCapitalContribution(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchAssociateCapitalContributions(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/associates_capital_contributions`);
      dispatch(slice.actions.fetchedAssociateCapitalContributions(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteAssociateCapitalContribution(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/associates_capital_contributions`, { data });
      dispatch(slice.actions.deleteAssociateCapitalContribution(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createAssociateCapitalContribution(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/associates_capital_contributions`, data);
      dispatch(slice.actions.createAssociateCapitalContribution(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateAssociateCapitalContribution(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/associates_capital_contributions`, data);
      dispatch(slice.actions.updateAssociateCapitalContribution(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchLoans(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/loans`);
      dispatch(slice.actions.fetchedLoans(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteLoan(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/loans`, { data });
      dispatch(slice.actions.deleteLoan(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createLoan(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/loans`, data);
      dispatch(slice.actions.createLoan(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateLoan(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/loans`, data);
      dispatch(slice.actions.updateLoan(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function getProjectFinancialForecast(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/finance`);
      dispatch(slice.actions.fetchAggregateFinancialProvisions(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchFinancingDetails(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/funding-details`);
      dispatch(slice.actions.fetchedFinances(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProjectTestSuites(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/testsuite`);
      dispatch(slice.actions.onTestSuiteSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function createProjectStakeholder(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.post(`v1/workstation/projects/${id}/stakeholders`, data);
      dispatch(slice.actions.onCreateStakeholderSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.onCreateStakeholderSuccess(error));
    }
  };
}

// ----------------------------------------------------------------------

export function fetchProjectStakeholder(id, apiPrefix) {
  return async (dispatch) => {
    try {
      const response = await API.get(`${apiPrefix}/projects/${id}/stakeholders`);
      dispatch(slice.actions.onFetchProjectStakeholdersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateProjectPreparation(data, id) {
  return async (dispatch) => {
    try {
      await API.post(`v1/workstation/projects/${id}/project_preparation`, data);
      dispatch(slice.actions.onUpdateBusinessPlanField());
    } catch (error) {
      dispatch(slice.actions.onFailedUpdateBusinessPlanField(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateProjectMarketResearch(data, id) {
  return async (dispatch) => {
    try {
      await API.post(`v1/workstation/projects/${id}/project_market_research`, data);
      dispatch(slice.actions.onUpdateBusinessPlanField());
    } catch (error) {
      dispatch(slice.actions.onFailedUpdateBusinessPlanField(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteProjectStakeholder(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.delete(`v1/workstation/projects/${id}/stakeholders`, { data });
      dispatch(slice.actions.onDeleteProjectStakeholder(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function updateProjectStakeholder(id, data) {
  return async (dispatch) => {
    try {
      const response = await API.put(`v1/workstation/projects/${id}/stakeholders`, data);
      dispatch(slice.actions.updateProjectStakeholdersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
