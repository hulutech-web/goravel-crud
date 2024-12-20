declare namespace API {
  type CarRequest = true;

  type indexParams = {
    /** name */
    name?: string;
    /** pageSize */
    pageSize?: string;
    /** currentPage */
    currentPage?: string;
    /** sort */
    sort?: string;
    /** order */
    order?: string;
  };
}
