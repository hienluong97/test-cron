import {Control } from "react-hook-form";

export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};


export interface InputFieldProps {
    name: string;
    label?: string;
    error?: string;
    helperText?:string;
    control: Control<any>;
  }

export interface PasswordProps {
    name: string;
    label?: string;
    control: Control<any>;
  }
  

export type Gender = "女性" | "男性" | "他";

export interface Job {
    id: number;
    title: string;
    job_description: string;
    job_status_id: string;
    job_statuses: any;
    companies: any;
}

export interface JobFilterVariables {
    title: any;
    job_status_id: any
}


// export interface EditUserForm {
//   first_name: string;
//   last_name: string;
//   first_kana: string;
//   last_kana: string;
//   gender: string;
//   birthday: string;
//   postal_code: string;
//   phone: string;
//   introduction: string;
//   address: string;
//   self_promotion: string;
//   qualifications: string;
//   languages: string;
//   business_types: string;
//   app_frameworks: string;
//   databases: string;
//   platforms: string;
//   other_qualifications: string;
//   name: string;
//   faculty: string;
//   major: string;
//   graduation_year: number;
//   pr_relationship: string;
//   pr_adaptation: string;
//   // email_opt_in?: boolean;
//   // is_demo_user?: boolean;
// }
