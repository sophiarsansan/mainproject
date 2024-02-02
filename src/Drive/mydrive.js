import React, { Component } from "react";
import './Drive.css';
import { ref, set, onValue } from "firebase/database";
import { db } from "../firebase";

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
      localStorage.setItem(`fileDetails_${fileId}`, JSON.stringify(newFile)); // Store individual file details

      // Store the file details in Firebase
      const driveFilesRef = ref(db, 'drive_files');
      set(driveFilesRef, updatedFiles);

      // Store the file content in Firebase
      const fileContentRef = ref(db, `fileContent_${fileId}`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        set(fileContentRef, fileContent);
      };
      reader.readAsDataURL(selectedFile); // Read the file as a data URL

      // Clear the selected file
      this.setState({ selectedFile: null });

      // Reset the file input value using the ref
      this.fileInputRef.current.value = "";
    }
  };

  downloadFile = (fileId) => {
    const fileContentRef = ref(db, `fileContent_${fileId}`);
    onValue(fileContentRef, (snapshot) => {
      const fileContent = snapshot.exists() ? snapshot.val() : '';
      const fileDetails = localStorage.getItem(`fileDetails_${fileId}`);

      if (fileContent && fileDetails) {
        const { name, type } = JSON.parse(fileDetails);

        const link = document.createElement("a");
        link.href = fileContent;
        link.download = `${name}_${fileId}.${type.split('/')[1]}`;

        // Append the link to the body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  deleteFile = (fileId) => {
    // Remove the file from the state
    const updatedFiles = this.state.uploadedFiles.filter(file => file.id !== fileId);
    this.setState({ uploadedFiles: updatedFiles });

    // Save the updated files array to local storage
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    localStorage.removeItem(`fileDetails_${fileId}`); // Remove individual file details from local storage

    // Remove file details and content from Firebase
    const driveFilesRef = ref(db, 'drive_files');
    set(driveFilesRef, updatedFiles);
    
    const fileContentRef = ref(db, `fileContent_${fileId}`);
    set(fileContentRef, null);
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
    // Load uploaded files from Firebase on component mount
    const driveFilesRef = ref(db, 'drive_files');
    onValue(driveFilesRef, (snapshot) => {
      const storedFiles = snapshot.exists() ? snapshot.val() : [];
      this.setState({ uploadedFiles: storedFiles });
    });
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
