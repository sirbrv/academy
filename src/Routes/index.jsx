import React from "react";

import Home from "./Hone/home";
import Cursos from "./Cursos/ListCursos";
import Registro from "./Estudiantes/Registro";
import Perfil from "./Estudiantes/Perfil";
import Students from "./Estudiantes/ListStudents";
import Teachers from "./Profesores/ListTeachers";
import Matricula from "./MatriculaCursos/ListMatricula";
import Contact from "./Contacts/ListContacts";
import Users from "./User/ListUser";
import Login from "./User/Login";
import Logout from "./User/Logout";
import Cambio from "./User/CambioClave";

// import Exit from "./components/Exit";

const routes = [
  { path: "/", element: <Home /> },
  {
    path: "/cursos",
    element: <Cursos title={"Gestión de Cursos"} accion="" />,
  },
  {
    path: "/students",
    element: <Students title={"Gestión de Estudiantes"} />,
  },
  {
    path: "/register",
    element: <Registro title={"Registro de Estudiantes"} />,
  },
  {
    path: "/perfil",
    element: <Perfil title={"Modicicación de Perfíl de Estudiantes"} />,
  },
  {
    path: "/teachers",
    element: <Teachers title={"Gestión de Profesores"} />,
  },
  {
    path: "/matricula",
    element: <Matricula title={"Matriculación de Estudiantes"} />,
  },
  {
    path: "/vecurso",
    element: <Cursos title={"Consulta de Cursos"} accion={"ver"} />,
  },
  {
    path: "/contact",
    element: <Contact title={"Contactos"} />,
  },
  {
    path: "/users",
    element: <Users title={"Gestión de Usuários"} />,
  },
  {
    path: "/login",
    element: <Login title={"Logín"} />,
  },
  { path: "/salir", element: <Logout /> },
  { path: "/cambioClave", element: <Cambio /> },
];

export default routes;
