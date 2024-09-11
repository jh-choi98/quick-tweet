import styled from "styled-components";

const Wrapper = styled.div``;

const Form = styled.form``;

const Input = styled.input``;

function CreateAccount() {
  return (
    <Wrapper>
      <Form>
        <Input name="name" placeholder="Name" type="text" required />
        <Input name="email" placeholder="Email" type="email" required />
        <Input />
        <Input />
      </Form>
    </Wrapper>
  );
}

export default CreateAccount;
