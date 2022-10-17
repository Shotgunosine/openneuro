import re
import subprocess

import pygit2

tag_ref = re.compile('^refs/tags/')

COMMITTER_NAME = 'Git Worker'
COMMITTER_EMAIL = 'git@openneuro.org'


def git_show(path, commitish, obj):
    repo = pygit2.Repository(path)
    commit, _ = repo.resolve_refish(commitish)
    data = (commit.tree / obj).read_raw().decode()
    return data


def git_show_object(path, obj):
    repo = pygit2.Repository(path)
    git_obj = repo.get(obj)
    if git_obj:
        return git_obj.read_raw().decode()
    else:
        raise KeyError('object not found in repository')


def delete_tag(path, tag):
    repo = pygit2.Repository(path)
    repo.references.delete(f'refs/tags/{tag}')


def git_tag(repo):
    return [repo.references[r] for r in repo.references if tag_ref.match(r)]


def git_tag_tree(repo, tag):
    """Return the tree object id for a local tag."""
    tag_reference = repo.references[f'refs/tags/{tag}']
    return repo.get(tag_reference.target).tree_id


def git_commit(repo, file_paths, author=None, message="[OpenNeuro] Recorded changes", parents=None):
    """Commit array of paths at HEAD."""
    # Refresh index with git-annex specific handling
    annex_command = ["git-annex", "add"] + file_paths
    subprocess.run(annex_command, check=True, cwd=repo.workdir)
    repo.index.add_all(file_paths)
    repo.index.write()
    return git_commit_index(repo, author, message, parents)


def git_commit_index(repo, author=None, message="[OpenNeuro] Recorded changes", parents=None):
    """Commit any existing index changes."""
    committer = pygit2.Signature(COMMITTER_NAME, COMMITTER_EMAIL)
    if not author:
        author = committer
    if parents is None:
        parent_commits = [repo.head.target.hex]
    else:
        parent_commits = parents
    tree = repo.index.write_tree()
    commit = repo.create_commit(
        'refs/heads/master', author, committer, message, tree, parent_commits)
    repo.head.set_target(commit)
    return commit
