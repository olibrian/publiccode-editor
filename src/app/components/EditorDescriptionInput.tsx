import { Input, TextArea } from "design-react-kit";
import { get } from "lodash";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RequiredDeep } from "type-fest";
import { displayName } from "../../i18n";
import PublicCode, { Description } from "../contents/publiccode";

type Props<T> = {
  fieldName: T;
  lang: string;
  required?: boolean;
  textarea?: boolean;
  deprecated?: boolean
};

export default function EditorInput<
  T extends FieldPathByValue<RequiredDeep<Description>, string>
>({ fieldName, lang, required, textarea, deprecated }: Props<T>) {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onBlur, onChange, value, name, ref },
    formState: { errors },
  } = useController<PublicCode>({
    control,
    name: `description.${lang}.${fieldName}`,
    shouldUnregister: true,
  });
  const { t } = useTranslation();

  const label = t(`publiccodeyml.description.${fieldName}.label`);
  const description = t(`publiccodeyml.description.${fieldName}.description`);

  const extraLangInfo = ` (in ${displayName(lang, undefined, "language")})`;

  const Tag = textarea ? TextArea : Input;

  return (
    <Tag
      onBlur={onBlur}
      onChange={({ target: { value } }) => onChange(value)}
      name={name}
      value={(value as string) || ""}
      innerRef={ref}
      label={`${label}${extraLangInfo}${required ? " *" : ""}${deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""}`}
      placeholder={label}
      infoText={description}
      valid={get(errors, `description.${lang}.${fieldName}`) && false}
      validationText={get(errors, `description.${lang}.${fieldName}.message`)}
      rows={textarea ? 3 : undefined}
    />
  );
}
