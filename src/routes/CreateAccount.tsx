import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/Github-button";
import { useForm } from "react-hook-form";

interface ICreateAccountForm {
  username: string;
  email: string;
  password: string;
  extraError?: string;
}

function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ICreateAccountForm>();

  const onValid = async (data: ICreateAccountForm) => {
    console.log("clicked");
    clearErrors();
    console.log("Errors cleared:", errors);
    if (isLoading) return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(credentials.user, { displayName: data.username });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError("extraError", { message: e.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetErrors = () => {
    clearErrors();
  };
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const {
  //     target: { name, value },
  //   } = e;
  //   if (name === "username") {
  //     setUsername(value);
  //   } else if (name === "email") {
  //     setEmail(value);
  //   } else if (name === "password") {
  //     setPassword(value);
  //   }
  // };
  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError("");
  //   if (isLoading || username === "" || email === "" || password === "") return;
  //   try {
  //     setIsLoading(true);
  //     const credentials = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     // console.log(credentials.user);
  //     await updateProfile(credentials.user, {
  //       displayName: username,
  //     });
  //     navigate("/");
  //   } catch (error) {
  //     if (error instanceof FirebaseError) {
  //       setError(error.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Wrapper>
      <Title>Join 𝕏</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register("username", {
            required: "Username required",
            onChange: resetErrors,
          })}
          placeholder="Username"
        />
        <Input
          {...register("email", {
            required: "Email required",
            onChange: resetErrors,
          })}
          placeholder="Email"
        />
        <Input
          {...register("password", {
            required: "Password required",
            onChange: resetErrors,
          })}
          placeholder="Password"
        />

        {/* <Input
          onChange={onChange}
          name="username"
          value={username}
          placeholder="Username"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        /> */}

        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {/* {error !== "" ? <Error>{error}</Error> : null} */}
      {errors?.username?.message ? (
        <Error>{errors?.username?.message}</Error>
      ) : null}
      {errors?.email?.message ? <Error>{errors?.email?.message}</Error> : null}
      {errors?.password?.message ? (
        <Error>{errors?.password?.message}</Error>
      ) : null}
      {errors?.extraError?.message ? (
        <Error>{errors?.extraError?.message}</Error>
      ) : null}
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <Switcher>
        Forgot your password?{" "}
        <Link to="/reset-password">Reset Password &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}

export default CreateAccount;
