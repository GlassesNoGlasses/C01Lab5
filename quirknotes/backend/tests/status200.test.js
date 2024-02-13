test("1+2=3, empty array is empty", () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

const deleteAllNotesFromDB = async () => {
  const deleteNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return deleteNotesRes;
};

const postNote = async (title, content) => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  return postNoteRes;
}

const getAllNotes = async () => {
  const allNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return allNotesRes;
}

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const allNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const allNotesData = await allNotesRes.json();

  expect(allNotesRes).toBeDefined();
  expect(allNotesData).toBeDefined();
  expect(allNotesRes.status).toStrictEqual(200);
  expect(allNotesData.response).toStrictEqual([]);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);

  const postNote2 = await postNote("t2", "c2");
  expect(postNote2).toBeDefined();
  expect(postNote2.status).toStrictEqual(200);

  const allNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const allNotesData = await allNotesRes.json();

  expect(allNotesRes).toBeDefined();
  expect(allNotesData).toBeDefined();
  expect(allNotesRes.status).toStrictEqual(200);
  expect(allNotesData.response.length).toStrictEqual(2);
  expect(allNotesData.response[0]).toMatchObject({title: "t1", content: "c1"});
  expect(allNotesData.response[1]).toMatchObject({title: "t2", content: "c2"});
});

test("/deleteNote - Delete a note", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);

  const postNote1Data = await postNote1.json();
  expect(postNote1Data).toBeDefined();

  const noteId = postNote1Data.insertedId;

  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  });

  expect(deleteNoteRes).toBeDefined();
  expect(deleteNoteRes.status).toStrictEqual(200);

  const deleteNodeData = await deleteNoteRes.json();
  expect(deleteNodeData).toBeDefined();
  expect(deleteNodeData.response).toMatch(`Document with ID ${noteId} deleted.`);
});

test("/patchNote - Patch with content and title", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);

  const postNote1Data = await postNote1.json();
  expect(postNote1Data).toBeDefined();

  const noteId = postNote1Data.insertedId;

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "t2",
      content: "c2",
    }),
  });

  expect(patchNoteRes).toBeDefined();
  expect(patchNoteRes.status).toStrictEqual(200);

  const patchData = await patchNoteRes.json();
  expect(patchData).toBeDefined();
  expect(patchData.response).toMatch(`Document with ID ${noteId} patched.`);

  const allNotes = await getAllNotes();
  expect(allNotes).toBeDefined();
  expect(allNotes.status).toStrictEqual(200);

  const allNotesData = await allNotes.json();
  expect(allNotesData).toBeDefined();
  expect(allNotesData.response.length).toStrictEqual(1);
  expect(allNotesData.response[0]).toMatchObject({title: "t2", content: "c2"});
});

test("/patchNote - Patch with just title", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);

  const postNote1Data = await postNote1.json();
  expect(postNote1Data).toBeDefined();

  const noteId = postNote1Data.insertedId;

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "t2",
    }),
  });

  expect(patchNoteRes).toBeDefined();
  expect(patchNoteRes.status).toStrictEqual(200);

  const patchData = await patchNoteRes.json();
  expect(patchData).toBeDefined();
  expect(patchData.response).toMatch(`Document with ID ${noteId} patched.`);

  const allNotes = await getAllNotes();
  expect(allNotes).toBeDefined();
  expect(allNotes.status).toStrictEqual(200);

  const allNotesData = await allNotes.json();
  expect(allNotesData).toBeDefined();
  expect(allNotesData.response.length).toStrictEqual(1);
  expect(allNotesData.response[0]).toMatchObject({title: "t2", content: "c1"});
});

test("/patchNote - Patch with just content", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);

  const postNote1Data = await postNote1.json();
  expect(postNote1Data).toBeDefined();

  const noteId = postNote1Data.insertedId;

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "c2",
    }),
  });

  expect(patchNoteRes).toBeDefined();
  expect(patchNoteRes.status).toStrictEqual(200);

  const patchData = await patchNoteRes.json();
  expect(patchData).toBeDefined();
  expect(patchData.response).toMatch(`Document with ID ${noteId} patched.`);

  const allNotes = await getAllNotes();
  expect(allNotes).toBeDefined();
  expect(allNotes.status).toStrictEqual(200);

  const allNotesData = await allNotes.json();
  expect(allNotesData).toBeDefined();
  expect(allNotesData.response.length).toStrictEqual(1);
  expect(allNotesData.response[0]).toMatchObject({title: "t1", content: "c2"});
});

test("/deleteAllNotes - Delete one note", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);
  
  const deleteNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  expect(deleteNotesRes).toBeDefined();
  expect(deleteNotesRes.status).toStrictEqual(200);

  const deleteNotesData = await deleteNotesRes.json();
  expect(deleteNotesData).toBeDefined();
  expect(deleteNotesData.response).toMatch(`1 note(s) deleted.`);

  const allNotes = await getAllNotes();
  expect(allNotes).toBeDefined();
  expect(allNotes.status).toStrictEqual(200);

  const allNotesData = await allNotes.json();
  expect(allNotesData).toBeDefined();
  expect(allNotesData.response.length).toStrictEqual(0);
});

test("/deleteAllNotes - Delete three notes", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);

  const postNote2 = await postNote("t2", "c2");
  expect(postNote2).toBeDefined();
  expect(postNote2.status).toStrictEqual(200);

  const postNote3 = await postNote("t2", "c2");
  expect(postNote3).toBeDefined();
  expect(postNote3.status).toStrictEqual(200);
  
  const deleteNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  expect(deleteNotesRes).toBeDefined();
  expect(deleteNotesRes.status).toStrictEqual(200);

  const deleteNotesData = await deleteNotesRes.json();
  expect(deleteNotesData).toBeDefined();
  expect(deleteNotesData.response).toMatch(`3 note(s) deleted.`);

  const allNotes = await getAllNotes();
  expect(allNotes).toBeDefined();
  expect(allNotes.status).toStrictEqual(200);

  const allNotesData = await allNotes.json();
  expect(allNotesData).toBeDefined();
  expect(allNotesData.response.length).toStrictEqual(0);
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  // Code here
  const deletedRes = await deleteAllNotesFromDB();
  expect(deletedRes).toBeDefined();
  expect(deletedRes.status).toStrictEqual(200);

  const postNote1 = await postNote("t1", "c1");
  expect(postNote1).toBeDefined();
  expect(postNote1.status).toStrictEqual(200);

  const postNote1Data = await postNote1.json();
  expect(postNote1Data).toBeDefined();
  
  const noteId = postNote1Data.insertedId;

  const updateColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      color: "#FF0000"
    })
  });

  expect(updateColorRes).toBeDefined()
  expect(updateColorRes.status).toStrictEqual(200)

  const updateColorData = await updateColorRes.json();
  expect(updateColorData).toBeDefined();
  expect(updateColorData.message).toMatch('Note color updated successfully.');

  const allNotes = await getAllNotes();
  expect(allNotes).toBeDefined();
  expect(allNotes.status).toStrictEqual(200);

  const allNotesData = await allNotes.json();
  expect(allNotesData).toBeDefined();
  expect(allNotesData.response.length).toStrictEqual(1);
  expect(allNotesData.response[0].color).toStrictEqual('#FF0000');
});