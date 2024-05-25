import { useEffect, useState, useRef } from "react";
import openModal from "../../componets/modal/OpenModal";
import Pagination from "../../componets/services/Pagination ";
import Student from "./Student";
import Buscador from "../../componets/Buscador";
import { useAppContext } from "../../hooks/appContext";

import Swal from "sweetalert2";
import { useFetch } from "../../hooks/useFetch";
import { FaTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
// import "./student.css";

export default function ListStudent({ title }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const { HandleNivelClose } = useAppContext();
  const url = `${hostServer}/idapi/v3/students`;
  const ref = useRef(null);

  // const url = "http://localhost:5000/api/students";
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  let { data, isLoading, getData, deleteData } = useFetch(`${url}`);
  const filters = [
    { id: 1, nombre: "dni", descrip: "Documento" },
    { id: 2, nombre: "apellido", descrip: "Apellido" },
    { id: 3, nombre: "email", descrip: "email" },
    { id: 4, nombre: "celular", descrip: "celular" },
  ];

  function handleAddstudents() {
    const modalNivel = 2;
    const tittle = "Adición de Estudiantes";
    openModal(
      <Student Student={""} edit={false} riviewList={updateList} />,
      null,
      "medio",
      tittle,
      modalNivel
    );
  }

  function handleEdit(student) {
    const modalNivel = 2;
    const tittle = "Edición de Estudiante";
    openModal(
      <Student student={student} edit={true} riviewList={updateList} />,
      null,
      "medio",
      tittle,
      modalNivel
    );
  }

  const updateList = async () => {
    await getStudents();
  };

  const handleDel = async (id) => {
    const url = `${hostServer}/api/v3/student`;

    // const url = "http://localhost:5000/api/student";
    const delId = id;
    Swal.fire({
      title: "Está Seguro?",
      text: "Desea eliminar este regístro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        const borrar = async () => {
          const resp = await deleteData(url, delId);
          getStudents();
          await Swal.fire({
            title: "Eliminádo!",
            text: "El Estudiante fué eliminádo.",
            icon: "success",
          });
        };
        borrar();
      }
    });
  };

  const nextPage = (pagItems, pageCurrent) => {
    setItemsPage(pagItems);
    setPage(pageCurrent);
  };

  const handlePageChange = (newSelectedItems) => {
    setSelectedItems(newSelectedItems);
  };

  const getStudents = async () => {
    const url = `${hostServer}/api/v3/students`;
    // const url = "http://localhost:5000/api/Students";
    const result = await getData(url);
  };

  useEffect(() => {
    if (data?.message || data?.message != undefined) {
      Swal.fire(data?.message);
    }
  }, [data]);

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <>
      {isLoading ? (
        <h3 className="mt-5">Cargando...</h3>
      ) : (
        selectedItems && (
          <>
            <div className="container">
              <div className="tittle-search">
                <div className="tittle">{title}</div>
                <div className="search">
                  <Buscador
                    filters={filters}
                    registros={data?.data?.data}
                    onPageChange={handlePageChange}
                  />
                </div>
                <button className="addBtn" onClick={handleAddstudents}>
                  <IoMdAdd />
                </button>
              </div>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    {/* <th scope="col">#</th> */}
                    <th scope="col">Documento</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo Electrónico</th>
                    <th scope="col">Celular</th>
                    <th scope="col" colSpan={3}>
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.status === 500 ? (
                    <tr>
                      <td scope="col" colSpan={7}>
                        <h3 className="textCenter">
                          No hay información para esta Entidad.
                        </h3>
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((student) => {
                      return (
                        <tr key={student._id}>
                          {/* <td>{student.id}</td> */}
                          <td>{student.dni}</td>
                          <td>{`${student.nombre} ${student.apellido}`} </td>
                          <td>{student.email}</td>
                          <td>{student.celular}</td>
                          <td>
                            <TbEdit
                              className=".btnShow"
                              style={{ fontSize: "25px" }}
                              onClick={() => handleEdit(student)}
                            />
                          </td>
                          <td>
                            <FaTrashAlt
                              style={{ fontSize: "25px" }}
                              onClick={() => handleDel(student._id)}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              {data?.data?.data && (
                <Pagination
                  items={data?.data?.data}
                  page={page}
                  pagItems={itemsPage}
                  nextPage={nextPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )
      )}
    </>
  );
}
