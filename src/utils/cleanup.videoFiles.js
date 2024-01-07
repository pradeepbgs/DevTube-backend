function cleanUploadedfiles(files) {
    try {
      if (
        files &&
        files.avatar &&
        Array.isArray(files.video) &&
        files.video[0]?.path
      ) {
        if (fs.existsSync(files.video[0].path)) {
          fs.unlinkSync(files.video[0].path);
        } else {
          console.warn(`File not found: ${files.video[0].path}`);
        }
      }

      if (
        files &&
        files.thumbnail &&
        Array.isArray(files.thumbnail) &&
        files.thumbnail[0]?.path
      ) {
        if (fs.existsSync(files.thumbnail[0].path)) {
          fs.unlinkSync(files.thumbnail[0].path);
        } else {
          console.warn(`File not found: ${files.thumbnail[0].path}`);
        }
      }
    } catch (error) {
      console.error("Error cleaning up uploaded files:", error);
    }
  }

  export {
    cleanUploadedfiles,
  }