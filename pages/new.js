import Form from '../components/Form'

const NewPet = () => {
  const storyForm = {
    name: '',
    description: '',
    coverPhoto: '',
    userId: '',
    content: ''
  }

  return <div className='overflow-hidden m-0 p-0'><Form formId="add-story-form" storyForm={storyForm} /></div>
}

export default NewPet
