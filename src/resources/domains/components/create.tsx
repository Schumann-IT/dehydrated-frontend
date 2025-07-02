import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from "react-admin";

export const DomainCreate = () => (
  <Create redirect="list" title="Create Domain">
    <SimpleForm>
      <TextInput source="domain" validate={required()} fullWidth label="Domain" />
      <TextInput source="alias" fullWidth label="Alias (Optional)" helperText="Use alias for more specific identification" />
      <BooleanInput source="enabled" defaultValue={true} label="Enabled" />
      <TextInput source="comment" multiline rows={4} fullWidth label="Comment" />
      <ArrayInput source="alternativeNames" label="Alternative Names">
        <SimpleFormIterator>
          <TextInput source="" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
