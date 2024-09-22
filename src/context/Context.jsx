import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput]=useState("");
    const [resentPrompt,setResentPrompt]=useState("");
    const [prevPropmts,setPrevPrompts]=useState([]);
    const [showResult,setShowResult]=useState(false);
    const [loading,setLoading]=useState(false);
    const [resultData,setResultData]=useState("");

    const deletePara =(index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async(prompt)=>{
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response ;
        if(prompt !== undefined){
            response = await run(prompt);
            setResentPrompt(prompt)
        }else{
            setPrevPrompts(prev=>[...prev,input])
            setResentPrompt(input)
            response = await run(input);
        }
        // setResentPrompt(input)
        // setPrevPrompts(prev=>[...prev,input])
        let responseArray = response.split("**")
        let newResponce="" ;
        for(let i=0;i<responseArray.length;i++){
            if(i === 0 || i%2 !==1){
                newResponce += responseArray[i]
            }else{
                newResponce += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponce2= newResponce.split("*").join("</br>")
        let newResponceArray = newResponce2.split(" ");
        for(let i=0;i<newResponceArray.length;i++){
            const nextWord = newResponceArray[i]+" ";
            deletePara(i,nextWord)
        }       
        setLoading(false)
        setInput("")
    }
    // onSent("Hello Gemini what is the top 10 company in the world") 
    const contextValue = {
        prevPropmts,
        setPrevPrompts,
        onSent,
        setResentPrompt,
        resentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}
export default ContextProvider;