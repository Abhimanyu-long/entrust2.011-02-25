import React from 'react';

export const ViewCaseComments = ({ comments }) => {
  return (
    <div className="container mt-4">
      {comments.map((comment, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-header d-flex justify-content-between">
            <div>
              <strong>#{index + 1}</strong>
              <span className="text-muted"> by {comment.user}</span>
            </div>
            <small className="text-muted">{comment.date}</small>
          </div>
          <div className="card-body">
            <p>{comment.message}</p>
            {comment.attachments.length > 0 && (
              <div>
                <h6>Attachments:</h6>
                <ul className="list-unstyled">
                  {comment.attachments.map((file, fileIndex) => (
                    <li key={fileIndex} className="d-flex align-items-center">
                      <a href={file.url} className="me-2" download>
                        {file.name}
                      </a>
                      <small className="text-muted">
                        {file.size} KB | Last downloaded: {file.lastDownloaded}
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="card-footer text-end">
            <button className="btn btn-secondary btn-sm me-2">Reply</button>
            <button className="btn btn-danger btn-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

