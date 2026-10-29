import { listContacts } from "@/platform/dataverse/sendbox-store";

export const dynamic = "force-dynamic";

export default function ContactsPage() {
  const contacts = listContacts();

  return (
    <div className="px-4 space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Contacts</h2>
      {contacts.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-sm text-stone-500">No contacts yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-800">
                  {contact.name}
                </span>
                <span className="text-xs text-stone-500">{contact.location}</span>
              </div>
              <div className="mt-1 text-xs text-stone-500">
                📞 {contact.phone}
                {contact.telegramId && ` • TG: ${contact.telegramId}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}