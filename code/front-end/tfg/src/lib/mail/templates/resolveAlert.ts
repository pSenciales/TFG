const resolveAlert = `
        <div class="space-y-4 text-left">
          <textarea
            id="swal-resolution"
            class="block w-full min-h-[6rem] rounded-md border border-input bg-transparent px-3 py-2 text-sm text-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="{{placeholder}}"
          ></textarea>
          <select
            id="swal-status"
            class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="processing">{{processing}}</option>
            <option value="accepted">{{accepted}}</option>
            <option value="rejected">{{rejected}}</option>
          </select>
        </div>
      `;
export default resolveAlert;