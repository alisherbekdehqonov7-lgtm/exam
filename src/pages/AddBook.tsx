import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Icon from "../components/ui/icon";
import { useCreateBook } from "../hooks/api/useCreateBook";
import { useGetAuthors } from "../hooks/api/useGetAuthors";
import { useCreateAuthor } from "../hooks/api/useCreateAuthor";

interface AddBookFormInputs {
  title: string;
  authorId: string;
  authorName?: string;
  price: number;
  description: string;
  genres: string[];
  isbn: string;
  pages: number;
  language: string;
  publisher: string;
  publicationDate: string;
  image?: FileList;
}

const AddBook = () => {
  const navigate = useNavigate();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to add a book.");
      navigate("/sign-in");
    }
  }, [navigate]);
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddBookFormInputs>({
    defaultValues: {
      language: "English",
      genres: [],
    },
  });

  const { authors, isPending: authorsLoading } = useGetAuthors();
  const { createBook, isPending: isCreatingBook } = useCreateBook();
  const { createAuthor, isPending: isCreatingAuthor } = useCreateAuthor();

  const imageFile = watch("image");
  const titleWatch = watch("title");
  const authorIdWatch = watch("authorId");

  if (imageFile && imageFile[0]) {
    const file = imageFile[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCoverPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  const availableGenres = [
    "Non-fiction",
    "Programming",
    "Technology",
    "Fiction",
    "Romance",
    "Mystery",
    "Fantasy",
    "Science Fiction",
    "History",
    "Biography",
    "Self-help",
    "Business",
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleAddNewAuthor = async () => {
    if (!newAuthorName.trim()) {
      toast.error("Please enter an author name");
      return;
    }

    try {
      const result = await createAuthor({ fullName: newAuthorName });
      const newAuthorId = result?.id || result?.data?.id;
      if (newAuthorId) {
        const newOption = document.createElement("option");
        newOption.value = newAuthorId;
        newOption.textContent = newAuthorName;
        const authorSelect = document.querySelector(
          'select[name="authorId"]',
        ) as HTMLSelectElement;
        if (authorSelect) {
          authorSelect.appendChild(newOption);
          authorSelect.value = newAuthorId;
        }
        setNewAuthorName("");
        setShowNewAuthorForm(false);
        toast.success("Author added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add author");
      console.error(error);
    }
  };

  const onSubmit = async (data: AddBookFormInputs) => {
    if (!data.authorId) {
      toast.error("Please select or add an author");
      return;
    }

    if (selectedGenres.length === 0) {
      toast.error("Please select at least one genre");
      return;
    }

    try {
      await createBook({
        title: data.title,
        authorId: data.authorId,
        price: Number(data.price),
        description: data.description,
        genres: selectedGenres,
        isbn: data.isbn,
        pages: Number(data.pages),
        language: data.language,
        publisher: data.publisher,
        publicationDate: data.publicationDate,
        status: "published",
      });

      toast.success("Book published successfully!");
      navigate("/books");
    } catch (error) {
      toast.error("Failed to publish book");
      console.error(error);
    }
  };

  const handleSaveAsDraft = async (data: AddBookFormInputs) => {
    if (!data.authorId) {
      toast.error("Please select or add an author");
      return;
    }

    try {
      await createBook({
        title: data.title,
        authorId: data.authorId,
        price: Number(data.price),
        description: data.description,
        genres: selectedGenres,
        isbn: data.isbn,
        pages: Number(data.pages),
        language: data.language,
        publisher: data.publisher,
        publicationDate: data.publicationDate,
        status: "draft",
      });

      toast.success("Book saved as draft!");
      navigate("/books");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error(error);
    }
  };

  const selectedAuthor = authors.find((a: any) => a.id === authorIdWatch);

  return (
    <div className="bg-white min-h-screen">
      <div className="container py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#1F2F28] mb-8">
              Add New Book
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-[#FBF7F0] rounded-2xl p-8 text-center">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <Icon.image />
                    <p className="text-sm font-medium text-[#1F2F28] mt-2">
                      Upload Cover Image
                    </p>
                    <p className="text-xs text-[#7A7A7A]">
                      Drag & drop or click to browse - JPG, PNG (up to 5MB)
                    </p>
                  </div>
                  <input
                    {...register("image")}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                  Title
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  placeholder="Enter book title"
                  className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#1F2F28]">
                    Author
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewAuthorForm(!showNewAuthorForm)}
                    className="text-xs text-[#2F5A3F] font-medium hover:underline"
                  >
                    + Add new author
                  </button>
                </div>

                {showNewAuthorForm && (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      placeholder="Enter author name"
                      className="flex-1 px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewAuthor}
                      disabled={isCreatingAuthor}
                      className="px-4 py-2 bg-[#2F5A3F] text-white rounded-lg disabled:opacity-50"
                    >
                      {isCreatingAuthor ? "Adding..." : "Add"}
                    </button>
                  </div>
                )}

                <select
                  {...register("authorId", { required: "Author is required" })}
                  className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                  disabled={authorsLoading}
                >
                  <option value="">Select an author</option>
                  {authors.map((author: any) => (
                    <option key={author.id} value={author.id}>
                      {author.fullName}
                    </option>
                  ))}
                </select>
                {errors.authorId && (
                  <span className="text-red-500 text-xs">
                    {errors.authorId.message}
                  </span>
                )}
              </div>

              <div className="flex gap-8">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                    Price ($)
                  </label>
                  <input
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 0, message: "Price must be positive" },
                    })}
                    type="number"
                    step="0.01"
                    placeholder="24.99"
                    className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                  />
                  {errors.price && (
                    <span className="text-red-500 text-xs">
                      {errors.price.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Enter book description"
                  rows={5}
                  className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2F28] mb-3">
                  Genre
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedGenres.includes(genre)
                          ? "bg-[#2F5A3F] text-white"
                          : "bg-[#E8DFD0] text-[#1F2F28] hover:bg-[#D8C9B8]"
                      }`}
                    >
                      {genre}
                      {selectedGenres.includes(genre) && " ×"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                  ISBN
                </label>
                <input
                  {...register("isbn")}
                  type="text"
                  placeholder="978-0-13-235088-4"
                  className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                    Pages
                  </label>
                  <input
                    {...register("pages")}
                    type="number"
                    placeholder="464"
                    className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                    Language
                  </label>
                  <select
                    {...register("language")}
                    className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Uzbek">Uzbek</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                    Publisher
                  </label>
                  <input
                    {...register("publisher")}
                    type="text"
                    placeholder="Prentice Hall"
                    className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2F28] mb-2">
                    Publication Date
                  </label>
                  <input
                    {...register("publicationDate")}
                    type="date"
                    className="w-full px-4 py-2 border border-[#D8C9B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isCreatingBook}
                  className="flex-1 px-6 py-3 bg-[#2F5A3F] text-white font-medium rounded-lg hover:bg-[#1E3F2A] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreatingBook ? "Publishing..." : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(handleSaveAsDraft)}
                  disabled={isCreatingBook}
                  className="flex-1 px-6 py-3 border-2 border-[#2F5A3F] text-[#2F5A3F] font-medium rounded-lg hover:bg-[#FBF7F0] disabled:opacity-50"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>

          <div className="w-80">
            <div className="sticky top-8">
              <h2 className="text-lg font-bold text-[#1F2F28] mb-4">
                Live Preview
              </h2>
              <div className="bg-[#2F5A3F] rounded-2xl overflow-hidden shadow-lg">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Book cover preview"
                    className="w-full aspect-3/4 object-cover"
                  />
                ) : (
                  <div className="w-full aspect-3/4 bg-gradient-to-br from-[#2F5A3F] to-[#1E3F2A] flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-sm opacity-75">No cover uploaded</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedGenres.length > 0 &&
                    selectedGenres.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="inline-block bg-[#E8DFD0] text-[#1F2F28] text-xs font-medium px-2 py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                </div>
                <h3 className="text-lg font-bold text-[#1F2F28] line-clamp-2">
                  {titleWatch || "Book Title"}
                </h3>
                <p className="text-[#6B7570] text-sm mt-1">
                  {selectedAuthor?.fullName || "Author Name"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
