"use client";

import {  Box} from "@mui/material";
import { useForm } from "react-hook-form";
import { InputField, PasswordField, SeclectField } from "@components/form/index";
import { useTransition } from "react";
import { createMember } from "../create/action/index";
import { Create } from "@refinedev/mui";
import { useNotification } from "@refinedev/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserSchema } from "@validation/index";
import { useAutocomplete } from "@refinedev/mui";



const CreateUserForm = () => {
    const { open, close } = useNotification();
    const [isPending, startTransition] = useTransition();
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(createUserSchema),
    });

    function onSubmit(data: any) {

        startTransition(async () => {
            const { success,
                error,
                successNotification } = await createMember(data);

            if (success) {
                console.log(successNotification);
                open?.({
                    type: "success",
                    message: "Notification Title",
                    description: successNotification?.message,
                    key: "notification-key",
                });
                history.back();
            } else {
                console.log("error.message", error);
                open?.({
                    type: "error",
                    message:
                        error.code,
                    description:
                        "That bai",
                    key: "notification-key",
                });
            }
        }
        );
    }

 const { autocompleteProps: userTypeAutocompleteProps } = useAutocomplete({
   resource: "user_types",
 });
 const user_types = userTypeAutocompleteProps.options;

    return (
      <Create saveButtonProps={{ onClick: handleSubmit(onSubmit) }}>
        <Box component="div">
          <InputField
            name="name"
            label="名前"
            control={control}
            helperText={(errors as any)?.name?.message}
          />
          <InputField name="email" label="メールアドレ" control={control} />
          <PasswordField name="password" label="パスワード" control={control} />
          <SeclectField
            name="user_type_id"
            label="会員タイプ"
            option={user_types}
            control={control}
          />
        </Box>
      </Create>
    );
};

export default CreateUserForm;