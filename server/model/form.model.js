import {model,Schema} from "mongoose"

const formSchema = new Schema({
    userId : {
        type : String,
        require : [true,"userId is required"],

    },
    title: {
        type : String,
        require : [true,"title is required"],

    },
    schema : {
        type : Object,
        require : [true,"schema is required"],

    },
    createdAt :{
        type : Date,
        default : Date.now
    }
    
    
    
})

const Form = model("Form",formSchema)
export default Form