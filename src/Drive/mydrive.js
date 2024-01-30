import React, { Component } from "react";
import './Drive.css';

class Drive extends Component {
  constructor(props) {
    super(props);
    // Create a ref for the file input element
    this.fileInputRef = React.createRef();
  }

  state = {
    selectedFile: null,
    uploadedFiles: [], // Array to store uploaded files
  };

  onFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  onFileUpload = () => {
    const { selectedFile, uploadedFiles } = this.state;

    if (selectedFile) {
      const fileId = Date.now(); // Generate a unique ID
      const uploadTime = new Date(); // Get the current time and date
      const newFile = {
        id: fileId,
        name: selectedFile.name,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
        uploadTime: uploadTime.toLocaleString(), // Format the time and date
      };

      // Update the uploaded files array
      const updatedFiles = [newFile, ...uploadedFiles];
      this.setState({ uploadedFiles: updatedFiles });

      // Save the updated files array to local storage
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

      // Store the file details in local storage
      localStorage.setItem(`fileDetails_${fileId}`, JSON.stringify(newFile));

      // Store the file content in local storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        localStorage.setItem(`fileContent_${fileId}`, fileContent);
      };
      reader.readAsText(selectedFile);

      // Clear the selected file
      this.setState({ selectedFile: null });

      // Reset the file input value using the ref
      this.fileInputRef.current.value = "";
    }
  };

  downloadFile = (fileId) => {
    const fileContent = localStorage.getItem(`fileContent_${fileId}`);
    const fileDetails = localStorage.getItem(`fileDetails_${fileId}`);

    if (fileContent && fileDetails) {
      const { name, type } = JSON.parse(fileDetails);

      const blob = new Blob([fileContent], { type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${name}_${fileId}.${type.split('/')[1]}`;
      link.click();
    }
  };

  deleteFile = (fileId) => {
    // Remove the file from the state
    const updatedFiles = this.state.uploadedFiles.filter(file => file.id !== fileId);
    this.setState({ uploadedFiles: updatedFiles });

    // Save the updated files array to local storage
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    // Remove file details and content from local storage
    localStorage.removeItem(`fileDetails_${fileId}`);
    localStorage.removeItem(`fileContent_${fileId}`);
  };

  fileData = () => {
    const { uploadedFiles } = this.state;

    return (
      <div>
        <h2>Uploaded Files:</h2>
        <table border="1" className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Last Modified</th>
              <th>Upload Time and Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{file.name}</td>
                <td>{file.type}</td>
                <td>{new Date(file.lastModified).toDateString()}</td>
                <td>{file.uploadTime}</td>
                <td>
                  <button onClick={() => this.downloadFile(file.id)}>
                    Download
                  </button>
                  <button onClick={() => this.deleteFile(file.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  componentDidMount() {
    // Load uploaded files from local storage on component mount
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    this.setState({ uploadedFiles: storedFiles });
  }

  render() {
    return (
      <div>
        <h1>YOUR LOCAL DRIVE</h1>
        <br></br>
        <br></br>
        <div>
          <input type="file" ref={this.fileInputRef} onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload!</button>
        </div>
        {this.fileData()}
      </div>
    );
  }
}

export default Drive;
