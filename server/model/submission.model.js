import {model,Schema} from "mongoose"

const submissionSchema = new Schema({
    formId : {
        type : Schema.Types.ObjectId,
        ref : "Form",
        required: true
    },
    userId :{
        type : String,
        required : false
    },
    data :{
        type:Object,
        required : true
    },
    submittedAt :{
        type:Date,
        default:Date.now
    }
})

const Submission = model ("Submission",submissionSchema)

export default Submission