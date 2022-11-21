import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const baseURL = "https://swapi.dev/api/people";
function App() {
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setTotalRows(response.data.count);
      setPeople(response.data.results);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Height",
      selector: (row) => row.height,
    },
    {
      name: "Mass",
      selector: (row) => row.mass,
    },
    {
      name: "Hair Color",
      selector: (row) => row.hair_color,
    },
  ];

  const onClick = () => {
    setLoading(true);
    if (search === "") {
      axios.get(baseURL).then((response) => {
        setPeople(response.data.results);
        setLoading(false);
      });
    } else {
      axios.get(baseURL, { params: { search } }).then((response) => {
        setPeople(response.data.results);
        setLoading(false);
      });
    }
  };
  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };
  const handlePageChange = (page) => {
    axios.get(baseURL, { params: { page } }).then((response) => {
      setTotalRows(response.data.count);
      setPeople(response.data.results);
      setLoading(false);
    });
  };
  return (
    <div className="App">
      <div className="search">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={onClick}>Search</button>
      </div>
      <h1>Table</h1>
      {loading ? (
        <p>Loading....</p>
      ) : (
        <DataTable
          columns={columns}
          data={people}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationComponentOptions={paginationComponentOptions}
          onChangePage={handlePageChange}
        />
      )}
    </div>
  );
}

const ExpandedComponent = ({ data }) => {
  const [dataToShow, setDataToShow] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      name: "Title",
      selector: (row) => row.data.title,
    },
    {
      name: "Director",
      selector: (row) => row.data.director,
    },
    {
      name: "Producer",
      selector: (row) => row.data.producer,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all(
        data.films.map((url) => axios.get(url))
      );
      setDataToShow(responses);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={dataToShow} />
      )}
    </>
  );
};

export default App;
