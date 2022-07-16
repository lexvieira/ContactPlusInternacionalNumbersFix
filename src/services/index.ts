import Contacts, {Contact} from 'react-native-contacts';

interface ContactStatus {
  status: boolean;
  message: string;
}

class ContactServices {
  async getAll(): Promise<any> {
    return await Contacts.getAll();
  }

  async updateContact(contact: Contact): Promise<ContactStatus> {
    let contactStatus: ContactStatus = {
      status: true,
      message: 'Success',
    };

    await Contacts.updateContact(contact)
      .then(result => {
        console.log('Contact Updated on Service');
        return result;
      })
      .catch(err => {
        if (err) {
          contactStatus.status = false;
          contactStatus.message = 'Error Updating Contact';
          console.log(err);
        }
      });
      return contactStatus;
  }

  async updateExistContact(contact: Contact): Promise<ContactStatus> {
    let contactStatus: ContactStatus = {
      status: true,
      message: 'Success',
    };

    await Contacts.editExistingContact(contact)
      .then(result => {
        console.log('Existed Contact Updated on Service');
        return result;
      })
      .catch(err => {
        if (err) {
          contactStatus.status = false;
          contactStatus.message = 'Error Updating Existed Contact';
          console.log(err);
        }
      });
      return contactStatus;
  }
  
  async addContact(contact: Contact): Promise<ContactStatus> {
    let contactStatus: ContactStatus = {
      status: true,
      message: 'Success',
    };

    await Contacts.addContact(contact)
      .then(result => {
        console.log('Contact Creating on Service');
        return result;
      })
      .catch(err => {
        if (err) {
          contactStatus.status = false;
          contactStatus.message = 'Error Creating Contact';
          console.log(err);
        }
      });
      return contactStatus;
  }  

  async deleteContact(contact: Contact): Promise<ContactStatus> {
    let contactStatus: ContactStatus = {
      status: true,
      message: 'Success',
    };

    await Contacts.deleteContact(contact)
      .then(result => {
        console.log('Contact Deleted on Service');
        return result;
      })
      .catch(err => {
        if (err) {
          contactStatus.status = false;
          contactStatus.message = 'Error Deleting Contact';
          console.log(err);
        }
      });
      return contactStatus;
  }
  
  
}

export default new ContactServices();
