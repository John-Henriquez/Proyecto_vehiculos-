"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Admin Badmin Cadmin Dadmin",
          rut: "11.111.111-1",
          email: "user@admin.com",
          password: await encryptPassword("admin123"),
          rol: "administrador",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Usuario Ausuario Busuario Cusuario",
            rut: "22.222.222-2",
            email: "user@usuario.com",
            password: await encryptPassword("usuario123"),
            rol: "usuario",
          }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };