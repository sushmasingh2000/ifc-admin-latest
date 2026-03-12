import * as Yup from "yup";

export const empregistration = Yup.object({
    district: Yup.string().required("District is required"),
    zone: Yup.string().required("Block is required"),
    village: Yup.string().required("Village is required"),
    shift: Yup.string().required("Shift is required"),
    grade: Yup.string().required("Grade is required"),
    qualification: Yup.string().required("Qualification is required"),

    f_name: Yup.string().required("First name is required"),

    gender: Yup.string().required("Gender is required"),

    joining_date: Yup.string().required("Joining date is required"),

    mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),

    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});
