import { useEffect, useRef } from "react";
import openModal from "../../componets/modal/OpenModal";
import Pagination from "../../componets/services/Pagination ";
import Matricula from "./Matricula";
import Buscador from "../../componets/Buscador";

import Swal from "sweetalert2";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FaTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useAppContext } from "../../hooks/appContext";

export default function ListMatricula({ title }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const { HandleNivelClose } = useAppContext();
  const url = `${hostServer}/api/v3/matriculas`;
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  let { data, isLoading, getData, deleteData } = useFetch(`${url}`);
  const bgChange = true;
  const modalNivel = 2;
  const filters = [
    { id: 1, nombre: "curso", descrip: "Curso" },
    { id: 2, nombre: "profesor", descrip: "Profesor" },
    { id: 3, nombre: "student", descrip: "Estudiante" },
    { id: 4, nombre: "turno", descrip: "Turno" },
  ];
  function handleAddMatriculas() {
    const tittle = "Adición de Matrícula";
    openModal(
      <Matricula matricula={""} edit={false} riviewList={updateList} />,
      null,
      "small",
      tittle,
      modalNivel,
      bgChange
    );
  }

  function handleEdit(matricula) {
    const tittle = "Edición de Matrícula";
    openModal(
      <Matricula matricula={matricula} edit={true} riviewList={updateList} />,
      null,
      "small",
      tittle,
      modalNivel,
      bgChange
    );
  }

  const updateList = async () => {
    await getMatriculas();
  };

  const handleDel = async (id) => {
    const url = `${hostServer}/api/v3/matricula`;

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
          getMatriculas();
          await Swal.fire({
            title: "Eliminádo!",
            text: "El Matricula fué eliminádo.",
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

  const getMatriculas = async () => {
    const url = `${hostServer}/api/v3/matriculas`;
    const result = await getData(url);
  };

  useEffect(() => {
    if (data?.message || data?.message != undefined) {
      Swal.fire(data?.message);
    }
  }, [data]);

  useEffect(() => {
    getMatriculas();
  }, []);

  return (
    <>
      {isLoading ? (
        <h3 className="mt-5">Cargando...</h3>
      ) : (
        selectedItems && (
          <>
            <div className=" container">
              <div className="tittle-search">
                <div className="tittle">{title}</div>
                <div className="search">
                  <Buscador
                    filters={filters}
                    registros={data?.data?.data}
                    onPageChange={handlePageChange}
                  />
                </div>
                <button className="addBtn" onClick={handleAddMatriculas}>
                  <IoMdAdd />
                </button>
              </div>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    {/* <th scope="col">#</th> */}
                    <th scope="col">Curso</th>
                    <th scope="col">Profesor</th>
                    <th scope="col">Alúmno</th>
                    <th scope="col">Túrno</th>
                    <th scope="col" colSpan={2}>
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
                    selectedItems.map((matricula) => {
                      return (
                        <tr key={matricula._id}>
                          {/* <td>{matricula.id}</td> */}
                          <td>{matricula.curso}</td>
                          <td>{`${matricula.profesor}`} </td>
                          <td>{`${matricula.student}`} </td>
                          <td>{`${matricula.turno}`} </td>
                          <td>
                            <TbEdit
                              className=".btnShow"
                              style={{ fontSize: "25px" }}
                              onClick={() => handleEdit(matricula)}
                            />
                          </td>
                          <td>
                            <FaTrashAlt
                              style={{ fontSize: "25px" }}
                              onClick={() => handleDel(matricula._id)}
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
