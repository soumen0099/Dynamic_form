
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FieldConfig } from "@/pages/superAdmin/types";

export interface SuperAdminState {
  studentFields: FieldConfig[];
  courseFields: FieldConfig[];
  branchFields: FieldConfig[];
  examResultFields: FieldConfig[];
  loading: boolean;
  error: string | null;
  activeForm: 'student' | 'course' | 'branch' | 'examResult';
}

const initialState: SuperAdminState = {
  studentFields: [],
  courseFields: [],
  branchFields: [],
  examResultFields: [],
  loading: false,
  error: null,
  activeForm: 'student',
};

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    setStudentFields(state, action: PayloadAction<FieldConfig[]>) {
      state.studentFields = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCourseFields(state, action: PayloadAction<FieldConfig[]>) {
      state.courseFields = action.payload;
      state.loading = false;
      state.error = null;
    },
    setBranchFields(state, action: PayloadAction<FieldConfig[]>) {
      state.branchFields = action.payload;
      state.loading = false;
      state.error = null;
    },
    setExamResultFields(state, action: PayloadAction<FieldConfig[]>) {
      state.examResultFields = action.payload;
      state.loading = false;
      state.error = null;
    },
    setActiveForm(state, action: PayloadAction<'student' | 'course' | 'branch' | 'examResult'>) {
      state.activeForm = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateStudentField(state, action: PayloadAction<{ fieldId: string; updates: Partial<FieldConfig> }>) {
      const { fieldId, updates } = action.payload;
      const fieldIndex = state.studentFields.findIndex(field => field.id === fieldId);
      if (fieldIndex !== -1) {
        state.studentFields[fieldIndex] = { ...state.studentFields[fieldIndex], ...updates };
      }
    },
    updateCourseField(state, action: PayloadAction<{ fieldId: string; updates: Partial<FieldConfig> }>) {
      const { fieldId, updates } = action.payload;
      const fieldIndex = state.courseFields.findIndex(field => field.id === fieldId);
      if (fieldIndex !== -1) {
        state.courseFields[fieldIndex] = { ...state.courseFields[fieldIndex], ...updates };
      }
    },
    updateBranchField(state, action: PayloadAction<{ fieldId: string; updates: Partial<FieldConfig> }>) {
      const { fieldId, updates } = action.payload;
      const fieldIndex = state.branchFields.findIndex(field => field.id === fieldId);
      if (fieldIndex !== -1) {
        state.branchFields[fieldIndex] = { ...state.branchFields[fieldIndex], ...updates };
      }
    },
    updateExamResultField(state, action: PayloadAction<{ fieldId: string; updates: Partial<FieldConfig> }>) {
      const { fieldId, updates } = action.payload;
      const fieldIndex = state.examResultFields.findIndex(field => field.id === fieldId);
      if (fieldIndex !== -1) {
        state.examResultFields[fieldIndex] = { ...state.examResultFields[fieldIndex], ...updates };
      }
    },
  },
});

export const {
  setStudentFields,
  setCourseFields,
  setBranchFields,
  setExamResultFields,
  setActiveForm,
  setLoading,
  setError,
  updateStudentField,
  updateCourseField,
  updateBranchField,
  updateExamResultField
} = superAdminSlice.actions;

export default superAdminSlice.reducer;
