import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import styled from "@emotion/styled";
import * as models from "models-matfyz";

let H1 = styled.h1`
  text-decoration: underline;
`

let BtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1.5rem;

  @media (max-width: 476px) {
    flex-direction: column;
  }
`

let InputText = styled.span`
  margin: 0;
  width: 75px;
  font-weight: bold;
  font-size: 1.12rem;
`

let InputArea = styled.input`
  width: 300px;
`

let TextArea = styled.textarea`
  margin-top: 2rem;
  min-width: 300px;
  min-height: 300px;
`


function App() {
    let [data, setData] = useState();
    let [courses, setCourses] = useState();
    let [triples, setTriples] = useState<any>([]);

    let generateTriples = () => {
        for (let model in models) {
            console.log(model);
        }
        setTriples(["abcs\n", "basdas"]);
    }


    return (
        <>
            <H1>
                Backend exporter
            </H1>
            <h2>
                Choose prefix for:
            </h2>
            <BtnWrapper>
                <InputText>Data: </InputText>
                <div>{"<"}<InputArea onChange={(e: any) => setData(e.target.value)}/>{">"}</div>
            </BtnWrapper>
            <BtnWrapper>
                <InputText>Courses: </InputText>
                <div>{"<"}<InputArea onChange={(e: any) => setCourses(e.target.value)}/>{">"}</div>
            </BtnWrapper>
            <button onClick={() => generateTriples()}>Generate</button>
            {triples && triples.length !== 0 ?
                <TextArea value={triples} readOnly/>
                : null
            }
        </>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);
