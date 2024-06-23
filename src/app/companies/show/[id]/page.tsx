"use client";
import { Stack, Typography } from "@mui/material";
import { useOne, useShow } from "@refinedev/core";
import {
    DateField,
    MarkdownField,
    NumberField,
    Show,
    TextFieldComponent as TextField,
} from "@refinedev/mui";
import RenderImage from "@components/render-image";

export default function CompanyShow() {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;
    const record = data?.data;


    return (
      <Show isLoading={isLoading}>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {"ID"}
          </Typography>
          <TextField value={record?.id} />
          <Typography variant="body1" fontWeight="bold">
            {"企業名"}
          </Typography>
          <TextField value={record?.name} />
          <Typography variant="body1" fontWeight="bold">
            {"サイト"}
          </Typography>
          <TextField value={record?.website} />

          <Typography variant="body1" fontWeight="bold">
            {"電話番号"}
          </Typography>
          <NumberField value={record?.phone ?? ""} />

          <Typography variant="body1" fontWeight="bold">
            {"メールアドレス"}
          </Typography>
          <TextField value={record?.email} />

          <Typography variant="body1" fontWeight="bold">
            {"企業の説明"}
          </Typography>
          <TextField value={record?.description} />
          {/* <MarkdownField value={record?.description} /> */}

          <Typography variant="body1" fontWeight="bold">
            {"アドレス"}
          </Typography>
          <TextField value={record?.address} />

          <Typography variant="body1" fontWeight="bold">
            {"ドメイン名"}
          </Typography>
          <TextField value={record?.domain_name} />

          <Typography variant="body1" fontWeight="bold">
            {"ドメインエイリアス"}
          </Typography>
          <TextField value={record?.domain_alias} />

          <Typography variant="body1" fontWeight="bold">
            {"Ga Tag"}
          </Typography>
          <TextField value={record?.ga_tag} />

          <Typography variant="body1" fontWeight="bold">
            {"Gtm Tag"}
          </Typography>
          <TextField value={record?.gtm_tag} />
          <br />

          <Typography variant="body1" fontWeight="bold">
            {"サムネイル"}
          </Typography>
          <RenderImage
            url={record?.thumbnail}
            size={{ width: 200, height: 200 }}
          />
          <br />
          <Typography variant="body1" fontWeight="bold">
            {"ファビコン"}
          </Typography>
          <RenderImage url={record?.favicon} size={{ width: 50, height: 50 }} />

          <br />
          <Typography variant="body1" fontWeight="bold">
            {"ロゴ画像"}
          </Typography>
          <RenderImage
            url={record?.img_logo}
            size={{ width: 50, height: 50 }}
          />
          <br />
          <Typography variant="body1" fontWeight="bold">
            {"カバー画像"}
          </Typography>
          <RenderImage
            url={record?.img_cover}
            size={{ width: 450, height: 300 }}
          />

          <Typography variant="body1" fontWeight="bold">
            {"作成日時"}
          </Typography>
          <DateField value={record?.createdAt} />
        </Stack>
      </Show>
    );
}
