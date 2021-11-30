import React from "react";
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import HeadSection from "../../../logged_out/components/home/HeadSection";
import { listarEventos, crearEvento } from "../../../controllers/api/api.eventos";


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function ListadoDeEventos() { 
  const tableData = {
    columns: [
      {
        title: 'Titulo',
        field: 'title',
        width: '20%',
      },
      {
        title: 'Descripción',
        field: 'description',
        width: '40%',
      },
      {
        title: 'Territorio',
        field: 'territory',
        width: '20%',
      },
      {
        title: 'Iniciativas',
        field: 'iniciativa',
        width: '10%',
      },
      {
        title: 'Estado',
        field: 'state',
        width: '10%',
      },
    ],
    data: [],
  }

  const [state, setState] = React.useState(null);

  const nuevoEvento = (newData) => {
    let eventoData = {
      titulo: newData.title,
      descripcion: newData.description,
      region: newData.territory,
      estado: true
    };

    crearEvento(eventoData)
      .then(response => {
        if (response.success) {
          console.log('Evento guardado correctamente');
        } else {
          console.log("Error guardando evento");
        }
      }); 
  };

  React.useEffect(() => { 
    const getEventos = async () => {
      let data = await listarEventos();
      data.response.forEach(evento => {
        tableData.data.push({
          title: evento.titulo,
          description: evento.descripcion,
          territory: evento.region,
          iniciativa: evento.iniciativas,
          state: (evento.estado ? 'Activo' : 'Inactivo')
        })
      });
      console.log(tableData);
      setState(tableData);
    }
    getEventos();
  }, []);

  return state && (
    <MaterialTable
      icons={tableIcons}
      title="Eventos"
      columns={state.columns}
      data={state.data}
      localization={{
        body: {
          emptyDataSourceMessage: 'No hay datos por mostrar',
          addTooltip: 'Añadir',
          deleteTooltip: 'Eliminar',
          editTooltip: 'Editar',
          editRow: {
            deleteText: '¿Segura(o) que quiere eliminar este turno?',
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Guardar',
          },
        },
        header: {
          actions: 'Acciones',
        },
        toolbar: {
          searchPlaceholder: 'Buscar',
          searchTooltip: 'Buscar',
        },
        pagination: {
          firstAriaLabel: 'Primera página',
          firstTooltip: 'Primera página',
          labelDisplayedRows: '{from}-{to} de {count}',
          labelRowsPerPage: 'Filas por página:',
          labelRowsSelect: 'filas',
          lastAriaLabel: 'Ultima página',
          lastTooltip: 'Ultima página',
          nextAriaLabel: 'Pagina siguiente',
          nextTooltip: 'Pagina siguiente',
          previousAriaLabel: 'Pagina anterior',
          previousTooltip: 'Pagina anterior',
        },
      }}
      options={{
        actionsColumnIndex: -1,
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                nuevoEvento(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}