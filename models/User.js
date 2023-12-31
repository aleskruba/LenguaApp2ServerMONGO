const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
    idUser: {
        type: Number,
        unique: true,
        default: () => {
          return User.countDocuments().then(count => count + 1);
        }
      },
    email:{
        type:String,
        required:[true,'please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'please enter a password'],
        minLength: [6,'Minimum password length is 6 characters']
    },

    firstName:{type:String},
    lastName:{type:String},
    country:{type:String},
    phone:{type:String},
    isTeacher:{type:String},
    teacherState:{type:Boolean},
    profile:{type: String},
    learnlang:{type: [String]},
    learnlanguages:{type: [{language:String}]  },
    teachlanguages:{type: [{language:String}]  },
    teacherType: {
        type: String,
        default: 'Tutor', // Set the default value to 'Tutor'
    },
    admin: 
    { type: Boolean,
       default: false
    },
    teachlang: {
        type: [String],
         },   
    teachingLanguages:{
             type: [String],
        },      
    tax: {
        type: Number,
        default: 0
      },
    profileText:{
        type:String
    },
    profileVideo:{
        type:String
    },
    teachingSlots: {
        type: [String],
         },  
    credits:{
        type:Number
    },
    transaction: {
        type:[ {date:String,
                description:String,
                amount:Number,
                completed:String }
        ]},
    memberDate: {
        type: Date, // Use the Date type for storing dates
        default: Date.now, // Set the default value to the current date
    }
         
})





userSchema.post('save',function(doc,next){
   //console.log('New user was created',doc)
   next()
})


userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt)

 //   console.log('user about to be created & saved ',this)
    next()
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email:email})
    if (user) {
       const auth = await bcrypt.compare(password,user.password)
        if (auth) {
            return user
        }
        throw Error('incorrect password')
    } 
    throw Error('incorrect email')
}

  
userSchema.statics.loginReset = async function(email){
    const user = await this.findOne({email:email})
    if (user) {
        return user
        }
     
    throw Error('incorrect email')
}

userSchema.statics.getNextIdUser = async function() {
    const user = await this.findOne().sort({ idUser: -1 });
    return user ? user.idUser + 1 : 1;
  };

const User = mongoose.model('user', userSchema);

module.exports = User