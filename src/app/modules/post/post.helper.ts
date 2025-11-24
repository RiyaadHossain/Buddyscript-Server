const buildCommentTree = (comments: any[]) => {
  const map = new Map();

  // initialize structure
  comments.forEach((c) => map.set(c._id.toString(), { ...c, replies: [] }));

  const roots: any[] = [];

  comments.forEach((c) => {
    if (c.parentComment) {
      const parent = map.get(c.parentComment.toString());
      if (parent) parent.replies.push(map.get(c._id.toString()));
    } else {
      roots.push(map.get(c._id.toString()));
    }
  });

  return roots;
};

export { buildCommentTree };
