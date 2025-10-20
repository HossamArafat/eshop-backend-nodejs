import bcrypt from 'bcrypt'

const setHashPass = (schema) => schema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)
})

export default setHashPass