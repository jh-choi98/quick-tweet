import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
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

interface ILoginForm {
  email: string;
  password: string;
  extraError?: string;
}

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ILoginForm>();

  const onValid = async (data: ILoginForm) => {
    clearErrors();
    console.log("Errors cleared:", errors);
    if (isLoading) return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
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
  // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const {
  //     target: { name, value },
  //   } = e;
  //   if (name === "email") {
  //     setEmail(value);
  //   } else if (name === "password") {
  //     setPassword(value);
  //   }
  // };

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError("");
  //   if (isLoading || email === "" || password === "") return;
  //   try {
  //     setIsLoading(true);
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate("/");
  //   } catch (e) {
  //     if (e instanceof FirebaseError) {
  //       setError(e.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        {/* <Input
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
        />
        */}
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
        <Input type="submit" value={isLoading ? "Loading..." : "Log In"} />
      </Form>
      {/* { error !== "" ? <Error>{error}</Error> : null} */}
      {errors?.email?.message ? <Error>{errors?.email?.message}</Error> : null}
      {errors?.password?.message ? (
        <Error>{errors?.password?.message}</Error>
      ) : null}
      {errors?.extraError?.message ? (
        <Error>{errors?.extraError?.message}</Error>
      ) : null}

      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      <Switcher>
        Forgot your password?{" "}
        <Link to="/reset-password">Reset Password &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}

export default Login;

// catch 블록에 에러를 추가하면 에러가 게속 남아있게 되어서
// 그 다음번에 try catch가 있는 함수를 실행하게 된다면
// 처리되지 않은 오류 때문에 catch 블록으로 빠지게 됨.
// 따라서 적절한 때에 설정된 오류를 핸들링 해줄 필요가 있음
