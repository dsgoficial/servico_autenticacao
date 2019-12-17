import styled from "styled-components";

export const Center = styled.div`
  background-color: #1abc9c;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 15px;
  padding: 0.8rem;

  form {
    display: flex;
    flex-direction: column;
  }

  h1 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 10px;
  }
`;

export const FormItem = styled.input`
  padding: 5px;
  margin-bottom: 2rem;
  height: 30px;
  width: 16rem;
  border: 1px solid grey;
`;
export const FormSubmit = styled.input`
  height: 35px;
  color: #fff;
  background-color: #1abc9c;
  border: none;
  letter-spacing: 0.2rem;
  transition: 0.3s opacity ease;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;
