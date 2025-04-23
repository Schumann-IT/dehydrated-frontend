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
      <TextInput source="domain" validate={required()} fullWidth />
      <BooleanInput source="enabled" defaultValue={true} />
      <TextInput source="comment" multiline rows={4} fullWidth />
      <ArrayInput source="alternativeNames" label="Alternative Names">
        <SimpleFormIterator>
          <TextInput source="" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
