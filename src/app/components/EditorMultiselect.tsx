import { get } from "lodash";
import { useEffect, useRef } from "react";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Multiselect } from "react-widgets";
import { Filter } from "react-widgets/Filter";
import { RequiredDeep } from "type-fest";
import PublicCode, { PublicCodeWithDeprecatedFields } from "../contents/publiccode";
import flattenObject from "../flatten-object-to-record";

type Props<T> = {
  fieldName: T;
  required?: boolean;
  data: Array<{ value: string; text: string }>;
  filter?: Filter<{ value: string; text: string }>;
  deprecated?: boolean;
};

type PublicCodeData = PublicCode | PublicCodeWithDeprecatedFields;

export default function EditorMultiselect<
  T extends FieldPathByValue<RequiredDeep<PublicCodeData>, Array<string>>
>({ fieldName, required, data, filter, deprecated }: Props<T>): JSX.Element {
  const { control } = useFormContext<PublicCodeData>();
  const {
    field: { onBlur, onChange, value },
    formState: { errors },
  } = useController<PublicCodeData, T>({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();

  const label = t(`publiccodeyml.${fieldName}.label`);
  const description = t(`publiccodeyml.${fieldName}.description`);
  const errorMessage = get(errors, `${fieldName}.message`);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const errorsRecord = flattenObject(errors as Record<string, { type: string; message: string }>);
    const formFieldKeys = Object.keys(errorsRecord);
    const isFirstError = formFieldKeys && formFieldKeys.length && formFieldKeys[0] === fieldName

    if (isFirstError) {
      inputRef.current?.focus()
    }

  }, [errors, fieldName, inputRef])

  return (
    <div className="form-group">
      <label className="active" htmlFor={fieldName}>
        {`${label}${required ? " *" : ""}${deprecated ? ` - ${t(`editor.form.deprecatedField`)}` : ""}`}
      </label>
      <Multiselect
        id={fieldName}
        onBlur={onBlur}
        onChange={(arr) => onChange(arr.map((e) => e.value))}
        value={value}
        data={data}
        dataKey="value"
        textField="text"
        filter={filter}
        ref={inputRef}
      />

      <small className="form-text">{description}</small>
      {errorMessage && (
        <div className="form-feedback just-validate-error-label">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
