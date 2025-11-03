import bcrypt from 'bcrypt'

export const hashPassword = async (plain) => {
    const salt = 10;
    return await bcrypt.hash(plain, salt)

}

export const comparePassword = async (plainPassword, hash) => {
    return await bcrypt.compare(plainPassword, hash);
}
