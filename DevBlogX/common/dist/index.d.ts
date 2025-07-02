import zod from "zod";
export declare const SignupInputs: zod.ZodObject<{
    fullname: zod.ZodOptional<zod.ZodString>;
    username: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    username: string;
    email: string;
    password: string;
    fullname?: string | undefined;
}, {
    username: string;
    email: string;
    password: string;
    fullname?: string | undefined;
}>;
export type SignupType = zod.infer<typeof SignupInputs>;
export declare const SigninInputs: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SigninType = zod.infer<typeof SigninInputs>;
export declare const CreatePost: zod.ZodObject<{
    title: zod.ZodString;
    content: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    title: string;
    content: string;
}, {
    title: string;
    content: string;
}>;
export type CreatePostType = zod.infer<typeof CreatePost>;
export declare const UpdatePost: zod.ZodObject<{
    title: zod.ZodOptional<zod.ZodString>;
    content: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
}>;
export type UpdatePostType = zod.infer<typeof UpdatePost>;
