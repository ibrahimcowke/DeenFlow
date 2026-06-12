import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, FileText, Mic, BookOpen, Heart, Pencil } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store';
import './Notes.css';

export default function Notes() {
  const { notes, addNote, deleteNote, folders } = useAppStore();
  const [activeFolder, setActiveFolder] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const filtered = notes.filter(n =>
    (activeFolder === 'all' || n.folder === activeFolder) &&
    (n.title?.toLowerCase().includes(search.toLowerCase()) || n.body?.toLowerCase().includes(search.toLowerCase()))
  );

  const createNote = () => {
    if (!newTitle.trim()) return;
    addNote({
      id: Date.now().toString(),
      title: newTitle,
      body: newBody,
      folder: activeFolder === 'all' ? 'all' : activeFolder,
      date: new Date().toISOString(),
    });
    setNewTitle('');
    setNewBody('');
    setEditing(null);
  };

  return (
    <div className="notes page-container">
      <div className="notes__layout">
        {/* Sidebar */}
        <div className="notes__sidebar">
          <h2 className="notes__sidebar-title">Notes</h2>
          {folders.map(folder => (
            <button
              key={folder.id}
              className={`notes__folder ${activeFolder === folder.id ? 'notes__folder--active' : ''}`}
              onClick={() => setActiveFolder(folder.id)}
            >
              <span>{folder.icon}</span>
              <span>{folder.name}</span>
              <span className="notes__folder-count">{notes.filter(n => folder.id === 'all' || n.folder === folder.id).length}</span>
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="notes__main">
          {/* Search */}
          <div className="notes__search">
            <Search size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." className="notes__search-input" />
          </div>

          {/* New Note Form */}
          {editing === 'new' ? (
            <GlassCard className="notes__new-form" padding="md">
              <input
                className="notes__new-title"
                placeholder="Note title..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                autoFocus
              />
              <textarea
                className="notes__new-body"
                placeholder="Start writing..."
                value={newBody}
                onChange={e => setNewBody(e.target.value)}
                rows={6}
              />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={createNote}>Save Note</Button>
              </div>
            </GlassCard>
          ) : (
            <Button variant="primary" icon={Plus} onClick={() => setEditing('new')} fullWidth>
              New Note
            </Button>
          )}

          {/* Notes List */}
          <div className="notes__list">
            {filtered.length === 0 ? (
              <div className="notes__empty">
                <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No notes yet. Create your first note!</p>
              </div>
            ) : filtered.map((note, i) => (
              <motion.div
                key={note.id}
                className="notes__note"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="notes__note-header">
                  <h3 className="notes__note-title">{note.title || 'Untitled'}</h3>
                  <button className="notes__delete" onClick={() => deleteNote(note.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="notes__note-preview">{note.body}</p>
                <span className="notes__note-date">{new Date(note.date).toLocaleDateString()}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
