import React, { PureComponent } from "react";
import ReactPaginate from "react-paginate";
import "./pagination.style.css";

class Pagination extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      orgServersData: [],
      perPage: 10,
      currentPage: 0,
      servers: [],
      errorMessage: null,
    };

    this.handlePageClick = this.handlePageClick.bind(this);
  }

  // handle click event and multiply the number of the page with 10 to get to the decent page
  handlePageClick = (event) => {
    const selectedPage = event.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.loadMoreData();
      }
    );
  };

  //get original data with all the nodes and build them up corresponding to the requested page
  loadMoreData() {
    const data = this.state.orgServersData;
    //console.log(data);

    const slice = data.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    this.setState({
      //Math.ceil() to round up number if the nodes aren't add up to 10
      pageCount: Math.ceil(data.length / this.state.perPage),
      servers: slice,
    });
  }

  componentDidMount() {
    //need to make the initial call with getDataFromApi() to populate table
    this.getDataFromApi();
    //setInterval to make request for updating the table every 5 minutes
    setInterval(() => {
      this.getDataFromApi();
    }, 300000);
  }

  getDataFromApi() {
    // GET request for the API using fetch with handling error and print it on screen and console
    fetch("https://600f10ec6c21e1001704e67a.mockapi.io/api/v1/stats")
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        //console.log('data-->'+JSON.stringify(data))
        let slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          orgServersData: data,
          servers: slice,
        });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
      });
  }

  render() {
    // deconstruct state variables
    const { errorMessage, servers, pageCount } = this.state;
    //if error occure only error will be written on screen
    if (errorMessage) {
      return <div className="error">There was an error: {errorMessage}</div>;
    } else {
      // else return the table
      return (
        <div className="wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Free RAM</th>
                <th>Allocated RAM</th>
                <th>Free Disk</th>
                <th>Allocated Disk</th>
                <th>Running since</th>
              </tr>
            </thead>
            <tbody>
              {/* map through server's properties and print them on the table*/}
              {servers.map((server) => (
                <tr key={server.id}>
                  <td>{server.id}</td>
                  <td>{server.free_ram}</td>
                  <td>{server.allocated_ram}</td>
                  <td>{server.free_disk}</td>
                  <td>{server.allocated_disk}</td>
                  <td>{server.up_since}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"<<"}
            nextLabel={">>"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      );
    }
  }
}

export default Pagination;
